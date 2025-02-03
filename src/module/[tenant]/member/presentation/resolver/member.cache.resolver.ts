// export const memberCacheResolver: ResolveFn<boolean> = (
//   route: ActivatedRouteSnapshot,
//   _state: RouterStateSnapshot
// ) => {
//
//   const store = inject(Store); // NGXS
//
//   const {app}: { app: IAppState } = store.snapshot();
//
//   if (app?.pageLoading) {
//     return EMPTY;
//   }
//
//   return store.dispatch(new MemberActions.InitDefaultsFromCache())
//     .pipe(
//       map(() => true),
//       catchError(() => EMPTY)
//     );
// };
