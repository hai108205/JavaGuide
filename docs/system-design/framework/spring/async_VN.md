---
title: Phân tích nguyên lý annotation Async
description: Giải thích chi tiết nguyên lý annotation bất đồng bộ @Async của Spring, bao gồm cấu hình tác vụ bất đồng bộ, thiết lập thread pool, cơ chế @EnableAsync và các vấn đề thường gặp khi sử dụng.
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring异步,@Async,EnableAsync,线程池,TaskExecutor,异步任务,Spring注解,方法异步
---

Annotation `@Async` được cung cấp bởi Spring framework, các class hoặc method được annotation này đánh dấu sẽ được thực thi trong **luồng bất đồng bộ (asynchronous thread)**. Điều này có nghĩa là khi method được gọi, caller sẽ không phải chờ method đó thực thi xong mà có thể tiếp tục thực thi các đoạn code phía sau.

Cách sử dụng annotation `@Async` rất đơn giản, chỉ cần hai bước:

1. Thêm annotation `@EnableAsync` trên class khởi chạy (startup class) để bật tác vụ bất đồng bộ.
2. Thêm annotation `@Async` trên method hoặc class cần thực thi bất đồng bộ.

```java
@SpringBootApplication
// 开启异步任务
@EnableAsync
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

// 异步服务类
@Service
public class MyService {

    // 推荐使用自定义线程池，这里只是演示基本用法
    @Async
    public CompletableFuture<String> doSomethingAsync() {

        // 这里会有一些业务耗时操作
        // ...
        // 使用 CompletableFuture 可以更方便地处理异步任务的结果，避免阻塞主线程
        return CompletableFuture.completedFuture("Async Task Completed");
    }

}
```

Tiếp theo, chúng ta cùng tìm hiểu nguyên lý底层 của `@Async`.

## Phân tích nguyên lý @Async

`@Async` có thể thực thi tác vụ bất đồng bộ, về bản chất là sử dụng **dynamic proxy (proxy động)** để thực hiện. Thông qua `BeanPostProcessor` (bộ hậu xử lý) trong Spring, một dynamic proxy được tạo cho class sử dụng annotation `@Async`, sau đó lời gọi tới method có annotation `@Async` sẽ bị dynamic proxy chặn lại (intercept), trong interceptor, việc thực thi method được đóng gói thành tác vụ bất đồng bộ và gửi tới thread pool để xử lý.

Tiếp theo, chúng ta sẽ phân tích chi tiết.

### Bật chế độ bất đồng bộ

Trước khi sử dụng `@Async`, cần thêm `@EnableAsync` trên class khởi chạy để bật chế độ bất đồng bộ, annotation `@EnableAsync` như sau:

```JAVA
// 省略其他注解 ...
@Import(AsyncConfigurationSelector.class)
public @interface EnableAsync { /* ... */ }
```

Trên annotation `@EnableAsync`, thông qua annotation `@Import` đã引入 class `AsyncConfigurationSelector`, do đó Spring sẽ tải class được引入 qua annotation `@Import`.

Class `AsyncConfigurationSelector` implements interface `ImportSelector`, do đó trong class này sẽ ghi đè method `selectImports()` để tùy chỉnh logic tải Bean, như sau:

```JAVA
public class AsyncConfigurationSelector extends AdviceModeImportSelector<EnableAsync> {
	@Override
	@Nullable
	public String[] selectImports(AdviceMode adviceMode) {
		switch (adviceMode) {
		   // 基于 Spring AOP 代理织入的通知，具体可能使用 JDK 动态代理或 CGLIB
			case PROXY:
				return new String[] {ProxyAsyncConfiguration.class.getName()};
	   // 基于 AspectJ 织入的通知
			case ASPECTJ:
				return new String[] {ASYNC_EXECUTION_ASPECT_CONFIGURATION_CLASS_NAME};
			default:
				return null;
		}
	}
}
```

Trong method `selectImports()`, sẽ chọn tải các class khác nhau dựa trên loại advice (通知) khác nhau, trong đó `adviceMode` có giá trị mặc định là `PROXY`.

Ở đây lấy ví dụ về advice dựa trên Spring AOP proxy, lúc này sẽ tải class `ProxyAsyncConfiguration`, như sau:

```JAVA
@Configuration
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class ProxyAsyncConfiguration extends AbstractAsyncConfiguration {
	@Bean(name = TaskManagementConfigUtils.ASYNC_ANNOTATION_PROCESSOR_BEAN_NAME)
	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	public AsyncAnnotationBeanPostProcessor asyncAdvisor() {
		 // ...
	  // 加载后置处理器
		AsyncAnnotationBeanPostProcessor bpp = new AsyncAnnotationBeanPostProcessor();

	  // ...
		return bpp;
	}
}
```

### Bộ hậu xử lý (BeanPostProcessor)

Trong class `ProxyAsyncConfiguration`, sẽ tải một bộ hậu xử lý `AsyncAnnotationBeanPostProcessor` thông qua annotation `@Bean`, bộ hậu xử lý này là chìa khóa giúp annotation `@Async` hoạt động.

Nếu một class hoặc method nào đó sử dụng annotation `@Async`, bộ xử lý `AsyncAnnotationBeanPostProcessor` sẽ tạo một dynamic proxy cho class đó.

Khi method của class này được thực thi, nó sẽ bị interceptor của đối tượng proxy chặn lại, trong đó method được annotation `@Async` đánh dấu sẽ được thực thi bất đồng bộ.

Code của `AsyncAnnotationBeanPostProcessor` như sau:

```JAVA
public class AsyncAnnotationBeanPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessor {
	@Override
	public void setBeanFactory(BeanFactory beanFactory) {
		super.setBeanFactory(beanFactory);
	  // 创建 AsyncAnnotationAdvisor，它是一个 Advisor
	  // 用于拦截带有 @Async 注解的方法并将这些方法异步执行。
		AsyncAnnotationAdvisor advisor = new AsyncAnnotationAdvisor(this.executor, this.exceptionHandler);
	  // 如果设置了自定义的 asyncAnnotationType，则将其设置到 advisor 中。
	  // asyncAnnotationType 用于指定自定义的异步注解，例如 @MyAsync。
		if (this.asyncAnnotationType != null) {
			advisor.setAsyncAnnotationType(this.asyncAnnotationType);
		}
		advisor.setBeanFactory(beanFactory);
		this.advisor = advisor;
	}
}
```

Class cha của `AsyncAnnotationBeanPostProcessor` implements interface `BeanFactoryAware`, do đó trong class này đã ghi đè method `setBeanFactory()` làm điểm mở rộng (extension point) để tải `AsyncAnnotationAdvisor`.

#### Tạo Advisor

`Advisor` là sự trừu tượng hóa (abstraction) của `Spring AOP` đối với `Advice` và `Pointcut`. `Advice` là logic advice được thực thi, `Pointcut` là điểm cắt (join point) nơi advice được thực thi.

Trong bộ hậu xử lý `AsyncAnnotationBeanPostProcessor`, `AsyncAnnotationAdvisor` sẽ được tạo. Trong constructor của nó, `Advice` và `Pointcut` tương ứng sẽ được xây dựng, như sau:

```JAVA
public class AsyncAnnotationAdvisor extends AbstractPointcutAdvisor implements BeanFactoryAware {

    private Advice advice; // 异步执行的 Advice
    private Pointcut pointcut; // 匹配 @Async 注解方法的切点

    // 构造函数
    public AsyncAnnotationAdvisor(/* 参数省略 */) {
        // 1. 创建 Advice，负责异步执行逻辑
        this.advice = buildAdvice(executor, exceptionHandler);
        // 2. 创建 Pointcut，选择要被增强的目标方法
        this.pointcut = buildPointcut(asyncAnnotationTypes);
    }

    // 创建 Advice
    protected Advice buildAdvice(/* 参数省略 */) {
        // 创建处理异步执行的拦截器
        AnnotationAsyncExecutionInterceptor interceptor = new AnnotationAsyncExecutionInterceptor(null);
        // 使用执行器和异常处理器配置拦截器
        interceptor.configure(executor, exceptionHandler);
        return interceptor;
    }

    // 创建 Pointcut
    protected Pointcut buildPointcut(Set<Class<? extends Annotation>> asyncAnnotationTypes) {
        ComposablePointcut result = null;
        for (Class<? extends Annotation> asyncAnnotationType : asyncAnnotationTypes) {
            // 1. 类级别切点：如果类上有注解则匹配
            Pointcut cpc = new AnnotationMatchingPointcut(asyncAnnotationType, true);
            // 2. 方法级别切点：如果方法上有注解则匹配
            Pointcut mpc = new AnnotationMatchingPointcut(null, asyncAnnotationType, true);

            if (result == null) {
                result = new ComposablePointcut(cpc);
            } else {
                // 使用 union 合并之前的切点
                result.union(cpc);
            }
            // 将方法级别切点添加到组合切点
            result = result.union(mpc);
        }
        // 返回组合切点，如果没有提供注解类型则返回 Pointcut.TRUE
        return (result != null ? result : Pointcut.TRUE);
    }
}
```

Cốt lõi của `AsyncAnnotationAdvisor` nằm ở việc xây dựng `Advice` và `Pointcut`:

- Xây dựng `Advice`: sẽ tạo interceptor `AnnotationAsyncExecutionInterceptor`, trong method `invoke()` của interceptor sẽ thực thi logic advice.
- Xây dựng `Pointcut`: được tạo thành từ `ClassFilter` và `MethodMatcher`, dùng để khớp (match) những method nào cần thực thi logic của advice (`Advice`).

#### Logic hậu xử lý

Method `postProcessAfterInitialization()` được implement trong bộ hậu xử lý `AsyncAnnotationBeanPostProcessor` nằm ở class cha `AbstractAdvisingBeanPostProcessor` của nó. Sau khi `Bean` được khởi tạo (initialization), sẽ đi vào method `postProcessAfterInitialization()` để thực hiện hậu xử lý.

Trong method hậu xử lý, sẽ phán đoán xem `Bean` có đáp ứng điều kiện của `Advisor` advice trong bộ hậu xử lý hay không, nếu có, thì tạo đối tượng proxy. Như sau:

```JAVA
// AbstractAdvisingBeanPostProcessor
public Object postProcessAfterInitialization(Object bean, String beanName) {
	if (this.advisor == null || bean instanceof AopInfrastructureBean) {
		return bean;
	}
	if (bean instanceof Advised) {
		Advised advised = (Advised) bean;
		if (!advised.isFrozen() && isEligible(AopUtils.getTargetClass(bean))) {
			if (this.beforeExistingAdvisors) {
				advised.addAdvisor(0, this.advisor);
			}
			else {
				advised.addAdvisor(this.advisor);
			}
			return bean;
		}
	}
	 // 判断给定的 Bean 是否符合后置处理器中 Advisor 通知的条件，符合的话，就创建代理对象。
	if (isEligible(bean, beanName)) {
		ProxyFactory proxyFactory = prepareProxyFactory(bean, beanName);
		if (!proxyFactory.isProxyTargetClass()) {
			evaluateProxyInterfaces(bean.getClass(), proxyFactory);
		}
	  // 添加 Advisor。
		proxyFactory.addAdvisor(this.advisor);
		customizeProxyFactory(proxyFactory);
	  // 返回代理对象。
		return proxyFactory.getProxy(getProxyClassLoader());
	}
	return bean;
}
```

### Chặn (intercept) method có annotation @Async

Việc thực thi method có annotation `@Async` sẽ bị chặn trong `AnnotationAsyncExecutionInterceptor`, logic của interceptor được thực thi trong method `invoke()`. Lúc này, method được annotation `@Async` đánh dấu sẽ được đóng gói thành tác vụ bất đồng bộ, giao cho executor để thực thi.

Method `invoke()` được định nghĩa trong class cha `AsyncExecutionInterceptor` của `AnnotationAsyncExecutionInterceptor`, như sau:

```JAVA
public class AsyncExecutionInterceptor extends AsyncExecutionAspectSupport implements MethodInterceptor, Ordered {
	@Override
	@Nullable
	public Object invoke(final MethodInvocation invocation) throws Throwable {
		Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);
		Method specificMethod = ClassUtils.getMostSpecificMethod(invocation.getMethod(), targetClass);
		final Method userDeclaredMethod = BridgeMethodResolver.findBridgedMethod(specificMethod);

	  // 1、确定异步任务执行器
		AsyncTaskExecutor executor = determineAsyncExecutor(userDeclaredMethod);

	  // 2、将要执行的方法封装为 Callable 异步任务
		Callable<Object> task = () -> {
			try {
	    // 2.1、执行方法
				Object result = invocation.proceed();
	    // 2.2、如果方法返回值是 Future 类型，阻塞等待结果
				if (result instanceof Future) {
					return ((Future<?>) result).get();
				}
			}
			catch (ExecutionException ex) {
				handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments());
			}
			catch (Throwable ex) {
				handleError(ex, userDeclaredMethod, invocation.getArguments());
			}
			return null;
		};
		// 3、提交任务
		return doSubmit(task, executor, invocation.getMethod().getReturnType());
	}
}
```

Trong method `invoke()`, chủ yếu có 3 bước:

1. Xác định executor thực thi tác vụ bất đồng bộ.
2. Đóng gói method được annotation `@Async` đánh dấu thành tác vụ bất đồng bộ `Callable`.
3. Gửi tác vụ cho executor để thực thi.

#### 1. Lấy executor tác vụ bất đồng bộ

Trong method `determineAsyncExecutor()`, sẽ lấy executor của tác vụ bất đồng bộ (tức là **thread pool** thực thi tác vụ bất đồng bộ). Code như sau:

```JAVA
// 确定异步任务的执行器
protected AsyncTaskExecutor determineAsyncExecutor(Method method) {
	 // 1、先从缓存中获取。
	AsyncTaskExecutor executor = this.executors.get(method);
	if (executor == null) {
		Executor targetExecutor;
	  // 2、获取执行器的限定符。
		String qualifier = getExecutorQualifier(method);
		if (StringUtils.hasLength(qualifier)) {
	   // 3、根据限定符获取对应的执行器。
			targetExecutor = findQualifiedExecutor(this.beanFactory, qualifier);
		}
		else {
	   // 4、如果没有限定符，则使用默认的执行器。即 Spring 提供的默认线程池：SimpleAsyncTaskExecutor。
			targetExecutor = this.defaultExecutor.get();
		}
		if (targetExecutor == null) {
			return null;
		}
	  // 5、将执行器包装为 TaskExecutorAdapter 适配器。
	  // TaskExecutorAdapter 是 Spring 对于 JDK 线程池做的一层抽象，还是继承自 JDK 的线程池 Executor。这里可以不用管太多，只要知道它是线程池就可以了。
		executor = (targetExecutor instanceof AsyncListenableTaskExecutor ?
				(AsyncListenableTaskExecutor) targetExecutor : new TaskExecutorAdapter(targetExecutor));
		this.executors.put(method, executor);
	}
	return executor;
}
```

Trong method `determineAsyncExecutor()`, executor (thread pool) của tác vụ bất đồng bộ đã được xác định, chủ yếu thông qua giá trị `value` của annotation `@Async` để lấy qualifier (định danh) của executor, sau đó dựa vào qualifier để tìm executor tương ứng trong `BeanFactory`.

Nếu không chỉ định thread pool trong annotation `@Async`, thì sẽ lấy thread pool mặc định thông qua `this.defaultExecutor.get()`, trong đó `defaultExecutor` được gán giá trị trong method dưới đây:

```JAVA
// AsyncExecutionInterceptor
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
	 // 1、尝试从 beanFactory 中获取线程池。
	Executor defaultExecutor = super.getDefaultExecutor(beanFactory);
	 // 2、如果 beanFactory 中没有，则创建 SimpleAsyncTaskExecutor 线程池。
	return (defaultExecutor != null ? defaultExecutor : new SimpleAsyncTaskExecutor());
}
```

Trong đó `super.getDefaultExecutor()` sẽ cố gắng lấy thread pool kiểu `Executor` trong `beanFactory`. Code như sau:

```JAVA
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
	if (beanFactory != null) {
		try {
		   // 1、从 beanFactory 中获取 TaskExecutor 类型的线程池。
			return beanFactory.getBean(TaskExecutor.class);
		}
		catch (NoUniqueBeanDefinitionException ex) {
			try {
				// 2、如果有多个，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				if (logger.isInfoEnabled()) {
					// ...
				}
			}
		}
		catch (NoSuchBeanDefinitionException ex) {
			try {
	    // 3、如果没有，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				// ...
			}
		}
	}
	return null;
}
```

Trong `getDefaultExecutor()`, nếu việc lấy thread pool từ `beanFactory` thất bại, thì sẽ tạo thread pool `SimpleAsyncTaskExecutor`.

Thread pool này mỗi lần thực thi tác vụ bất đồng bộ đều tạo một thread mới để thực thi tác vụ, không tái sử dụng (reuse) thread, dẫn đến chi phí (overhead) thực thi tác vụ bất đồng bộ rất lớn. Một khi lượng truy cập đồng thời (concurrency) tăng đột biến tại một thời điểm trên method được annotation `@Async` đánh dấu, ứng dụng sẽ tạo ra một lượng lớn thread, từ đó ảnh hưởng đến chất lượng dịch vụ thậm chí dẫn đến dịch vụ không khả dụng (unavailable).

Cùng một thời điểm, nếu gửi 10000 tác vụ vào thread pool `SimpleAsyncTaskExecutor`, thì thread pool đó sẽ tạo ra 10000 thread, method `execute()` của nó như sau:

```JAVA
// SimpleAsyncTaskExecutor：execute() 内部会调用 doExecute()
protected void doExecute(Runnable task) {
    // 创建新线程
    Thread thread = (this.threadFactory != null ? this.threadFactory.newThread(task) : createThread(task));
    thread.start();
}
```

**Khuyến nghị: Khi sử dụng `@Async` cần tự chỉ định thread pool, tránh rủi ro do thread pool mặc định của Spring mang lại.**

Trong annotation `@Async`, `value` chỉ định qualifier của thread pool, dựa vào qualifier có thể lấy **thread pool tùy chỉnh**. Code lấy qualifier như sau:

```JAVA
// AnnotationAsyncExecutionInterceptor
protected String getExecutorQualifier(Method method) {
	// 1.从方法上获取 Async 注解。
	Async async = AnnotatedElementUtils.findMergedAnnotation(method, Async.class);
	 // 2. 如果方法上没有找到 @Async 注解，则尝试从方法所在的类上获取 @Async 注解。
	if (async == null) {
		async = AnnotatedElementUtils.findMergedAnnotation(method.getDeclaringClass(), Async.class);
	}
	 // 3. 如果找到了 @Async 注解，则获取注解的 value 值并返回，作为线程池的限定符。
	 //    如果 "value" 属性值为空字符串，则使用默认的线程池。
	 //    如果没有找到 @Async 注解，则返回 null，同样使用默认的线程池。
	return (async != null ? async.value() : null);
}
```

#### 2. Đóng gói method thành tác vụ bất đồng bộ

Sau khi method `invoke()` lấy được executor, sẽ đóng gói method thành tác vụ bất đồng bộ, code như sau:

```JAVA
// 将要执行的方法封装为 Callable 异步任务
Callable<Object> task = () -> {
    try {
        // 2.1、执行被拦截的方法 (proceed() 方法是 AOP 中的核心方法，用于执行目标方法)
        Object result = invocation.proceed();

        // 2.2、代理返回给调用方的是实际的异步 Future，而目标方法受方法签名约束，
        //     会先返回一个临时 Future，因此这里需要在工作线程中解包临时 Future 的结果。
        if (result instanceof Future) {
            return ((Future<?>) result).get(); // 阻塞等待 Future 的结果
        }
    }
    catch (ExecutionException ex) {
        // 2.3、处理 ExecutionException 异常。 ExecutionException 是 Future.get() 方法抛出的异常，
        handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments()); // 处理原始异常
    }
    catch (Throwable ex) {
        // 2.4、处理其他类型的异常。 将异常、被拦截的方法和方法参数作为参数调用 handleError() 方法进行处理。
        handleError(ex, userDeclaredMethod, invocation.getArguments());
    }
    // 2.5、如果方法返回值不是 Future 类型，或者发生异常，则返回 null。
    return null;
};
```

So với `Runnable`, `Callable` có thể trả về kết quả và ném ra ngoại lệ (exception).

Việc thực thi `invocation.proceed()` (thực thi method gốc) được đóng gói thành tác vụ bất đồng bộ `Callable`. Ở đây chỉ trả về khi `result` (giá trị trả về của method) có kiểu là `Future`, nếu là kiểu khác thì trả về trực tiếp `null`.

Do đó, method được annotation `@Async` đánh dấu nếu sử dụng kiểu trả về khác ngoài `Future` thì sẽ không thể lấy được kết quả thực thi của method.

#### 3. Gửi tác vụ bất đồng bộ

Trong `AsyncExecutionInterceptor#invoke()`, sau khi đóng gói method cần thực thi thành tác vụ `Callable`, sẽ giao tác vụ cho executor để thực thi. Dưới đây là đoạn trích source code `doSubmit()` của Spring Framework 5.3.x, trong đó có chứa các API liên quan đến `ListenableFuture` sau này đã bị deprecated và loại bỏ:

```JAVA
protected Object doSubmit(Callable<Object> task, AsyncTaskExecutor executor, Class<?> returnType) {
    // 根据方法的返回值类型，选择不同的异步执行方式并返回结果。
    // 1. 如果方法返回值是 CompletableFuture 类型
    if (CompletableFuture.class.isAssignableFrom(returnType)) {
        // 使用 CompletableFuture.supplyAsync() 方法异步执行任务。
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            }
            catch (Throwable ex) {
                throw new CompletionException(ex); // 将异常包装为 CompletionException，以便在 future.get() 时抛出
            }
        }, executor);
    }
    // 2. 如果方法返回值是 ListenableFuture 类型
    else if (ListenableFuture.class.isAssignableFrom(returnType)) {
        // 将 AsyncTaskExecutor 强制转换为 AsyncListenableTaskExecutor，
        // 并调用 submitListenable() 方法提交任务。
        // AsyncListenableTaskExecutor 是 ListenableFuture 的专用异步执行器，
        // 它可以返回一个 ListenableFuture 对象，允许添加回调函数来监听任务的完成。
        return ((AsyncListenableTaskExecutor) executor).submitListenable(task);
    }
    // 3. 如果方法返回值是 Future 类型
    else if (Future.class.isAssignableFrom(returnType)) {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务，并返回一个 Future 对象。
        return executor.submit(task);
    }
    // 4. 如果方法返回值是 void 或其他类型
    else {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务。
        // 由于方法返回值是 void，因此不需要返回任何结果，直接返回 null。
        executor.submit(task);
        return null;
    }
}
```

Trong method `doSubmit()`, sẽ chọn cách gửi tác vụ khác nhau dựa trên kiểu giá trị trả về khác nhau của method được annotation `@Async` đánh dấu, cuối cùng tác vụ sẽ được executor (thread pool) thực thi.

### Tổng kết

![Async原理总结](./images/async/async.png)

Cốt lõi để hiểu nguyên lý của `@Async` nằm ở việc hiểu annotation `@EnableAsync`, annotation này bật chức năng tác vụ bất đồng bộ.

Luồng chính như hình trên, sẽ thông qua bộ hậu xử lý (BeanPostProcessor) để tạo đối tượng proxy, sau đó việc thực thi method có `@Async` trong đối tượng proxy sẽ đi vào interceptor bên trong `Advice`, sau đó đóng gói method thành tác vụ bất đồng bộ và gửi tới thread pool để xử lý.

## Khuyến nghị sử dụng @Async

### Thread pool tùy chỉnh

Nếu không cấu hình thread pool một cách tường minh, thì bên dưới `@Async` trước tiên sẽ cố gắng lấy thread pool trong `BeanFactory`, nếu không lấy được, sẽ tạo một implementation `SimpleAsyncTaskExecutor`. `SimpleAsyncTaskExecutor` về bản chất không được coi là một thread pool thực sự, vì nó khởi động một thread mới cho mỗi request mà không tái sử dụng thread hiện có, điều này mang lại một số vấn đề tiềm ẩn, ví dụ như tiêu tốn tài nguyên quá lớn.

Cụ thể về cách lấy thread pool có thể tham khảo bài viết này: [浅析 Spring 中 Async 注解底层异步线程池原理｜得物技术](https://mp.weixin.qq.com/s/FySv5L0bCdrlb5MoSfQtAA).

Nhất định phải cấu hình tường minh một thread pool, khuyến nghị dùng `ThreadPoolTaskExecutor`. Hơn nữa, còn có thể chỉ định các thread pool khác nhau cho các method bất đồng bộ khác nhau dựa trên tính chất và nhu cầu của tác vụ.

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "executor1")
    public Executor executor1() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("AsyncExecutor1-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "executor2")
    public Executor executor2() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("AsyncExecutor2-");
        executor.initialize();
        return executor;
    }
}
```

Chỉ định tên Bean của thread pool trong annotation `@Async`:

```java
@Service
public class AsyncService {

    @Async("executor1")
    public void performTask1() {
        // 任务1的逻辑
        System.out.println("Executing Task1 with Executor1");
    }

    @Async("executor2")
    public void performTask2() {
        // 任务2的逻辑
        System.out.println("Executing Task2 with Executor2");
    }
}
```

### Tránh annotation @Async bị vô hiệu hóa

Annotation `@Async` sẽ bị vô hiệu hóa (失效) trong một số tình huống sau, cần chú ý:

**1. Gọi method bất đồng bộ trong cùng một class**

Nếu bạn gọi một method có annotation `@Async` bên trong cùng một class, thì method này sẽ không được thực thi bất đồng bộ.

```java
@Service
public class MyService {

    public void myMethod() {
        // 直接通过 this 引用调用，绕过了 Spring 的代理机制，异步执行失效
        asyncMethod();
    }

    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}
```

Điều này là do cơ chế bất đồng bộ của Spring được thực hiện thông qua **proxy**, mà lời gọi method trong nội bộ cùng một class sẽ bỏ qua cơ chế proxy của Spring, tức là bỏ qua đối tượng proxy, gọi trực tiếp thông qua tham chiếu `this`. Do không đi qua proxy, tất cả các xử lý liên quan đến proxy (tức là gửi tác vụ tới thread pool để thực thi bất đồng bộ) sẽ không xảy ra.

Để tránh vấn đề này, cách làm được khuyến nghị là chuyển method bất đồng bộ sang một Spring Bean khác.

```java
@Service
public class AsyncService {
    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}

@Service
public class MyService {
    @Autowired
    private AsyncService asyncService;

    public void myMethod() {
        asyncService.asyncMethod();
    }
}
```

**2. Sử dụng từ khóa static cho method bất đồng bộ**

Nếu method có annotation `@Async` bị từ khóa `static`修饰, thì method này sẽ không được thực thi bất đồng bộ.

Điều này là do cơ chế bất đồng bộ của Spring được thực hiện thông qua proxy, vì static method không thuộc về instance mà thuộc về class và không tham gia kế thừa, cơ chế proxy của Spring (dù dựa trên JDK hay CGLIB) không thể chặn static method để cung cấp các chức năng增强 như thực thi bất đồng bộ.

Do giới hạn về篇幅, ở đây không đi sâu giới thiệu thêm, các bạn chưa hiểu về cơ chế proxy có thể xem bài viết [Java 代理模式详解](https://javaguide.cn/java/basis/proxy.html) do tôi viết.

Nếu bạn cần thực thi logic của một static method một cách bất đồng bộ, có thể cân nhắc thiết kế một wrapper method không phải static, wrapper method này sử dụng annotation `@Async` và gọi static method trong nội bộ của nó.

```java
@Service
public class AsyncService {

    @Async
    public void asyncWrapper() {
        // 调用静态方法
        SClass.staticMethod();
    }
}

public class SClass {
    public static void staticMethod() {
        // 执行一些操作
    }
}
```

**3. Quên bật hỗ trợ bất đồng bộ**

Spring Boot mặc định không bật hỗ trợ bất đồng bộ, hãy đảm bảo thêm annotation `@EnableAsync` trên class cấu hình chính `Application` để bật chức năng bất đồng bộ.

```java
@SpringBootApplication
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**4. Class chứa method có annotation `@Async` phải là Spring Bean**

Method có annotation `@Async` phải nằm trong Bean do Spring quản lý, chỉ có như vậy, Spring mới có thể áp dụng proxy khi tạo Bean, proxy có thể chặn lời gọi method và thực hiện logic thực thi bất đồng bộ. Nếu method đó không nằm trong bean do Spring quản lý, Spring sẽ không thể tạo proxy cần thiết, annotation `@Async` sẽ không có bất kỳ hiệu quả nào.

### Kiểu giá trị trả về

Khuyến nghị định nghĩa kiểu giá trị trả về của method có annotation `@Async` là `void` và `Future`.

- Nếu không cần lấy kết quả trả về của method bất đồng bộ, định nghĩa kiểu trả về là `void`.
- Nếu cần lấy kết quả trả về của method bất đồng bộ, định nghĩa kiểu trả về là `Future` (thường sử dụng `CompletableFuture`). `ListenableFuture` thuộc về API cũ của Spring, không nên tiếp tục sử dụng trong Spring 6.1 trở lên.

Nếu định nghĩa kiểu trả về của method có annotation `@Async` là kiểu khác (như `Object`, `String` v.v.), thì không thể lấy được giá trị trả về của method.

Thiết kế này phù hợp với nguyên tắc cơ bản của lập trình bất đồng bộ, tức là caller không nên kỳ vọng ngay lập tức một kết quả, mà nên có thể lấy kết quả tại một thời điểm nào đó trong tương lai. Nếu kiểu trả về là `Future`, caller có thể sử dụng đối tượng `Future` được trả về này để truy vấn trạng thái của tác vụ, hủy tác vụ, hoặc lấy kết quả khi tác vụ hoàn thành.

### Xử lý ngoại lệ trong method bất đồng bộ

Ngoại lệ được ném ra trong method bất đồng bộ sẽ không được捕获 trực tiếp bởi thread gọi. Method bất đồng bộ trả về `Future` hoặc `CompletableFuture` sẽ phơi bày (expose) ngoại lệ thông qua Future, có thể sử dụng `get()`, `join()` hoặc các method xử lý ngoại lệ của `CompletableFuture` để xử lý; method bất đồng bộ trả về `void` không thể truyền ngoại lệ cho caller, có thể cấu hình `AsyncUncaughtExceptionHandler` toàn cục.

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer{

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }

}

// 自定义异常处理器
class CustomAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        // 日志记录或其他处理逻辑
    }
}
```

### Không xem xét đến quản lý transaction

Khi method có annotation `@Async` cần hỗ trợ transaction, nhất định phải sử dụng độc lập trên chính method bất đồng bộ đó.

```java
@Service
public class AsyncTransactionalService {

    @Async
    // Propagation.REQUIRES_NEW 表示 Spring 在执行异步方法时开启一个新的、与当前事务无关的事务
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void asyncTransactionalMethod() {
        // 这里的操作会在新的事务中执行
        // 执行一些数据库操作
    }
}
```

### Không chỉ định thứ tự thực thi method bất đồng bộ

Việc thực thi method có annotation `@Async` là non-blocking, chúng có thể hoàn thành theo thứ tự bất kỳ. Nếu cần xử lý kết quả theo một thứ tự cụ thể, bạn có thể thiết lập kiểu trả về của method là `Future` hoặc `CompletableFuture`, thông qua đối tượng giá trị trả về để thực hiện một method sau khi một method khác hoàn thành.

```java
@Async
public CompletableFuture<String> fetchDataAsync() {
    return CompletableFuture.completedFuture("Data");
}

@Async
public CompletableFuture<String> processDataAsync(String data) {
    // 方法本身已经由 @Async 调度到受 Spring 管理的执行器，不要再提交到 commonPool。
    return CompletableFuture.completedFuture("Processed " + data);
}
```

Method `processDataAsync` được thực thi sau `fetchDataAsync`:

```java
CompletableFuture<String> dataFuture = asyncService.fetchDataAsync();
dataFuture.thenCompose(data -> asyncService.processDataAsync(data))
          .thenAccept(result -> System.out.println(result));
```

##