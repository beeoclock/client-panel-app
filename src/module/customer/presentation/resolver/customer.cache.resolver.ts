// export const customerCacheResolver: ResolveFn<boolean> = () => {
//
//   const store = inject(Store); // NGXS
//
//   const {app}: { app: IAppState } = store.snapshot();
//
//   if (app?.pageLoading) {
//     return EMPTY;
//   }
//
//   return store.dispatch(new CustomerActions.InitDefaultsFromCache())
//     .pipe(
//       map(() => true),
//       catchError(() => EMPTY)
//     );
// };
