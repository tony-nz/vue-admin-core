/**
 * nextFactory
 * @param context
 * @param middleware
 * @param index
 * @param params
 *
 * Creates a `nextMiddleware()` function which not only
 * runs the default `next()` callback but also triggers
 * the subsequent Middleware function.
 *
 */
export function nextFactory(context, middleware, index, params) {
  const subsequentMiddleware = middleware[index];
  /**
   * If no subsequent Middleware exists,
   * the default `next()` callback is returned.
   */

  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    /**
     * Run the default Vue Router `next()` callback first.
     * Then run the subsequent Middleware with a new
     */
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1, params);
    subsequentMiddleware({ ...context, next: nextMiddleware, params });
  };
}
