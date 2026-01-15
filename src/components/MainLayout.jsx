// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";

// export default function MainLayout() {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <main className="ml-64 flex-1 px-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="ml-64 w-full">
        <Outlet />
      </main>
    </div>
  );
}
