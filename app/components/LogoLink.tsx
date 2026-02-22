import { NavLink } from "react-router";

export function LogoLink() {
  return (
    <NavLink to="/" className="group flex items-center p-4">
      <div className="relative font-bold leading-none">
        {/* Width lock (invisible) */}
        <span className="invisible select-none">BobTeachesMusic</span>

        {/* Lowercase */}
        <span className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
          bobteachesmusic
        </span>

        {/* CamelCase */}
        <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          BobTeachesMusic
        </span>
      </div>
    </NavLink>
  );
}
