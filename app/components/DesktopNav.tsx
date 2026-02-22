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

import { Button } from "./ui/button";

import { useAuth } from "~/contexts/useAuth";
import { LogoLink } from "./LogoLink";

export default function DesktopNav() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  return (
    <div className="desk w-[100vw] flex justify-between items-center">
      <LogoLink />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavLink to="/lessons">Lessons</NavLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li>
                  <NavLink
                    to="/lessons/guitar"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
                      Guitar
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      So you wanna play guitar?
                    </p>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/lessons/bass"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Bass</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      So you wanna play Bass?
                    </p>
                  </NavLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavLink
                to="/free-stuff"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                Free Stuff
              </NavLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li>
                  <NavLink
                    to="/resources/guitar"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
                      Guitar
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Free Guitar Charts
                    </p>
                  </NavLink>
                  <li>
                    <NavLink
                      to="/resources/guitar"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        Bass
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Free Bass Charts
                      </p>
                    </NavLink>
                  </li>
                </li>
              </ul> */}
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
      <div className="flex justify-center items-center p-4">
        <Button asChild>
          <NavLink to={isAuthenticated ? "/free-stuff" : "/login"}>
            {isAuthenticated ? "Free Stuff" : "Login"}
          </NavLink>
        </Button>
      </div>
    </div>
  );
}
