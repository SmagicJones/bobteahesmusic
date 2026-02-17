import { NavLink } from "react-router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./ui/navigation-menu";

import { kitchens, type Kitchen } from "~/data/kitchens";
import { bathrooms, type Bathroom } from "~/data/bathrooms";
import { Button } from "./ui/button";

import { useAuth } from "~/contexts/useAuth";


export default function DesktopNav() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  return (
    <div className="desk w-[100vw] flex justify-between items-center">
      <NavLink to="/" className="flex justify-center items-center p-4">
        <p className="text-md font-bold hover:text-purple-600">
          JNC Improvements
        </p>
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavLink to="/kitchens">Kitchens</NavLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li>
                  <NavLink
                    to="/kitchens"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
                      All Our Designs
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Browse through all our kitchen designs
                    </p>
                  </NavLink>
                </li>
                {kitchens.map((kitchen) => (
                  <li key={kitchen.id}>
                    <NavLink
                      to={`/kitchens/${kitchen.slug}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        {kitchen.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {kitchen.subtitle}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavLink
                to="/bathrooms"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                Bathrooms
              </NavLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li>
                  <NavLink
                    to="/bathrooms"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
                      All Our Designs
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Browse through all our Bathroom designs
                    </p>
                  </NavLink>
                </li>
                {bathrooms.map((bathroom) => (
                  <li key={bathroom.id}>
                    <NavLink
                      to={`/bathrooms/${bathroom.slug}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        {bathroom.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {bathroom.subtitle}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavLink to="/contact">Contact</NavLink>
            </NavigationMenuTrigger>

            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavLink to="/login" className="flex justify-center items-center p-4">
        <Button>{isAuthenticated ? "Dashboard" : "Sign In"}</Button>
      </NavLink>
    </div>
  );
}
