"use client";

import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    function escape(event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <>
      <button
        className="menu-toggle"
        ref={toggle}
        type="button"
        aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      <nav
        id="main-navigation"
        className={`main-nav${open ? " is-open" : ""}`}
        aria-label="Navegación principal"
        onClick={() => setOpen(false)}
      >
        <a href="#producto">Producto</a>
        <a href="#capacidades">Capacidades</a>
        <a href="#contacto">Contacto</a>
        <a
          className="nav-crm"
          href="https://admincrm.undercodeec.com/admin/crm/login/"
        >
          Acceso al espacio de trabajo <span aria-hidden="true">↗</span>
        </a>
        <a className="nav-contact" href="https://undercodeec.com/contacto/">
          Conversemos <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </>
  );
}
