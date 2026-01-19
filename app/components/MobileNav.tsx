import { NavLink } from "react-router";

import { MenuIcon, X } from "lucide-react";

import DarkModeToggle from "./DarkModeToggle";
import { Login } from "./login/login";
import Logout from "./logout/logout";

import { useAuth } from "~/contexts/useAuth";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import { Button } from "./ui/button";
import { kitchens } from "~/data/kitchens";
import { bathrooms } from "~/data/bathrooms";

export default function MobileNav() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  return (
    <main>
      <div className="mobile w-[100%] flex justify-between">
        <NavLink to="/" className="flex justify-center items-center p-4">
          <p className="text-md font-bold hover:text-purple-600">JNC Designs</p>
        </NavLink>
        <div className="p-4">
          <Drawer direction="right">
            <DrawerTrigger>
              <MenuIcon className="z-10" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerClose className="flex justify-end">
                  <X />
                </DrawerClose>
                <ul className="">
                  <li>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="cursor-pointer hover:text-slate-400">
                          Kitchens
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="text-left">
                            <li>
                              <NavLink
                                to="/kitchens"
                                className="cursor-pointer hover:text-slate-400"
                              >
                                <DrawerClose className="pb-2 cursor-pointer">
                                  All Kitchens
                                </DrawerClose>
                              </NavLink>
                            </li>
                            {kitchens.map((kitchen) => (
                              <li>
                                <NavLink
                                  to={`/kitchens/${kitchen.slug}`}
                                  target="_blank"
                                  className="cursor-pointer hover:text-slate-400"
                                >
                                  <DrawerClose className="cursor-pointer">
                                    {kitchen.title}
                                  </DrawerClose>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                  <li>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="cursor-pointer hover:text-slate-400">
                          <NavLink to="/bathrooms">Bathrooms</NavLink>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="text-left">
                            <li>
                              <NavLink
                                to="/bathrooms"
                                className="cursor-pointer hover:text-slate-400"
                              >
                                <DrawerClose className="pb-2 cursor-pointer">
                                  All Bathrooms
                                </DrawerClose>
                              </NavLink>
                            </li>
                            {bathrooms.map((bathroom) => (
                              <li>
                                <NavLink
                                  to={`/bathrooms/${bathroom.slug}`}
                                  target="_blank"
                                  className="cursor-pointer hover:text-slate-400"
                                >
                                  <DrawerClose className="cursor-pointer">
                                    {bathroom.title}
                                  </DrawerClose>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                </ul>
              </DrawerHeader>
              <div className="p-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <NavLink to="dashboard">
                      <Button className="w-full">Dashboard</Button>
                    </NavLink>
                    <Logout />
                  </div>
                ) : (
                  <Login />
                )}
              </div>

              <div className="p-4">
                <DarkModeToggle />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </main>
  );
}
