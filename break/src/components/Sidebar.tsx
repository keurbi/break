import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  PauseCircle,
  Activity,
  Grid,
  Settings,
  Heart,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(router.pathname);
  const [hovered, setHovered] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const primaryColor = "#7346FF";
  const grayColor = "#656565";

  const menuItems = [
    {
      href: "/breaks",
      icon: (
        <PauseCircle
          color={
            selected === "/breaks" || hovered === "/breaks"
              ? primaryColor
              : grayColor
          }
          className="w-14 h-14 transition-transform duration-200 group-hover:scale-110"
        />
      ),
      label: "Pauses",
    },
    {
      href: "/activities",
      icon: (
        <Activity
          color={
            selected === "/activities" || hovered === "/activities"
              ? primaryColor
              : grayColor
          }
          className="w-14 h-14 transition-transform duration-200 group-hover:scale-110"
        />
      ),
      label: "Activités",
    },
    {
      href: "/dashboard",
      icon: (
        <Grid
          color={
            selected === "/dashboard" || hovered === "/dashboard"
              ? primaryColor
              : grayColor
          }
          className="w-14 h-14 transition-transform duration-200 group-hover:scale-110"
        />
      ),
      label: "Tableau de bord",
    },
    {
      href: "/settings",
      icon: (
        <Settings
          color={
            selected === "/settings" || hovered === "/settings"
              ? primaryColor
              : grayColor
          }
          className="w-14 h-14 transition-transform duration-200 group-hover:scale-110"
        />
      ),
      label: "Paramètres",
    },
  ];

  return (
    <div className="w-28 h-full bg-white fixed flex flex-col items-center py-4">
      <div className="flex flex-col items-center">
        <Link href="/welcome">
          <div
            className="cursor-pointer mb-1"
            onMouseEnter={() => setHovered("/welcome")}
            onMouseLeave={() => setHovered(null)}
          >
            <Heart
              color={
                selected === "/welcome" || hovered === "/welcome"
                  ? primaryColor
                  : grayColor
              }
              className="w-16 h-16 transition-transform duration-200 hover:scale-110"
            />
          </div>
        </Link>
        <div
          className="w-12 h-[4.5px] mb-32"
          style={{
            backgroundColor:
              selected === "/welcome" || hovered === "/welcome"
                ? primaryColor
                : grayColor,
          }}
        ></div>
        <nav className="flex flex-col items-center justify-center flex-1 space-y-20">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="cursor-pointer group hover:scale-110 transition-transform duration-200"
                onClick={() => setSelected(item.href)}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.icon}
              </div>
            </Link>
          ))}
          {role === "manager" && (
            <Link href="/managers">
              <div
                className="cursor-pointer group hover:scale-110 transition-transform duration-200"
                onClick={() => setSelected("/managers")}
                onMouseEnter={() => setHovered("/managers")}
                onMouseLeave={() => setHovered(null)}
              >
                <Users
                  color={
                    selected === "/managers" || hovered === "/managers"
                      ? primaryColor
                      : grayColor
                  }
                  className="w-14 h-14"
                />
              </div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
