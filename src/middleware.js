// export function onRequest({ url, redirect, request }, next) {
//   const langParam = url.searchParams.get('lang');
  
//   if (langParam) {
//     const supportedLocales = ['el', 'en'];
    
//     if (supportedLocales.includes(langParam)) {
//       // Get the pathname without query params
//       let pathname = url.pathname;
      
//       // Remove trailing slash if not root
//       if (pathname !== '/' && pathname.endsWith('/')) {
//         pathname = pathname.slice(0, -1);
//       }
      
//       // Create the localized URL based on your i18n config
//       let localizedPath;
      
//       if (langParam === 'en') {
//         // Default locale, no prefix needed
//         localizedPath = pathname === '' ? '/' : pathname;
//       } else {
//         // Add locale prefix
//         localizedPath = `/${langParam}${pathname === '/' ? '' : pathname}`;
//       }
      
//       // Handle specific route mappings from your config
//       if (pathname === '/about' && langParam === 'el') {
//         localizedPath = '/el/poioi-eimaste';
//       }
      
//       return redirect(localizedPath, 301);
//     }
//   }
  
//   return next();
// }