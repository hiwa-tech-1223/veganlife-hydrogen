import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-stone-900 text-stone-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                    >
                      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <span className="text-lg text-white font-medium">
                      {header.shop.name}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-400">
                    Premium vegan products for a sustainable lifestyle. Certified
                    organic, cruelty-free, and eco-friendly.
                  </p>
                </div>

                {/* Shop */}
                {/* <div>
                  <h3 className="text-white text-sm font-semibold mb-4">
                    Shop
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <NavLink
                        to="/collections/skincare"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Skincare
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/collections/beauty"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Beauty
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/collections/wellness"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Wellness
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/collections/nutrition"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Nutrition
                      </NavLink>
                    </li>
                  </ul>
                </div> */}

                {/* Company */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-4">
                    Company
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {footer?.menu
                      ? footer.menu.items.slice(0, 4).map((item) => {
                          if (!item.url) return null;
                          const url =
                            item.url.includes('myshopify.com') ||
                            item.url.includes(publicStoreDomain) ||
                            item.url.includes(
                              header.shop.primaryDomain?.url ?? '',
                            )
                              ? new URL(item.url).pathname
                              : item.url;
                          return (
                            <li key={item.id}>
                              <NavLink
                                to={url}
                                className="text-stone-400 hover:text-white transition-colors"
                              >
                                {item.title}
                              </NavLink>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>

                {/* Support */}
                {/* <div>
                  <h3 className="text-white text-sm font-semibold mb-4">
                    Support
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Shipping Info
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Returns
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div> */}
              </div>

              <div className="border-t border-stone-800 mt-8 pt-8 text-sm text-center text-stone-500">
                <p>
                  &copy; {new Date().getFullYear()} {header.shop.name}. All
                  rights reserved. | Worldwide shipping available
                </p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
