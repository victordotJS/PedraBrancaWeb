import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as TbIcons from "react-icons/tb"

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Cadastro",
    path: "/cadastro",
    icon: <IoIcons.IoIosPersonAdd />,
    cName: "nav-text",
  },
  {
    title: "Relatório",
    path: "/relatorio",
    icon: <TbIcons.TbReportAnalytics />,
    cName: "nav-text",
  },
];