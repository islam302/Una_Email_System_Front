import { ToastContainer } from "react-fox-toast";
import routers from "./routers";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import LoadingScreen from "./components/website-loading/LoadingScreen";
import { ThemeUpdater } from "./views/middlewares/ThemeUpdater";

const App = () => {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <ThemeUpdater />
        <RouterProvider router={routers} />
        <ToastContainer position="top-center" duration={5000} />
      </Suspense>
    </>
  );
};

export default App;
