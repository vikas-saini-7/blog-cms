"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Privacy Pages",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Author Policy", href: "/author-policy" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "All Blogs", href: "/blogs" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Auth Pages",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Create Blog", href: "/dashboard/blogs/create" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Social Media",
    links: [
      { label: "Twitter", href: "https://twitter.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Instagram", href: "https://instagram.com", external: true },
    ],
  },
];

const Footer: React.FC = () => {
  const pathname = usePathname();

  if (
    pathname.includes("/auth/login") ||
    pathname.includes("/auth/register") ||
    pathname.includes("/auth/onboarding")
  ) {
    return null;
  }
  return (
    <footer className="bg-white text-gray-800 mt-8">
      <div className="container mx-auto px-4 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-heading font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {section.links.map((link, linkIdx) =>
                  link.external ? (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline hover:text-orange-500 transition duration-200 ease-in-out"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="hover:underline hover:text-orange-500 transition duration-200 ease-in-out"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PLUMA WEB. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
