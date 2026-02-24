export const PROJECT_REQUIRED_ROUTES = ["/", "/my-tasks", "/reports"];

export const isProjectRequiredRoute = (pathname: string): boolean => {
  return PROJECT_REQUIRED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};
