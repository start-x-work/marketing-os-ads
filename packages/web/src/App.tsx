import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CampaignAnalyze } from "./routes/CampaignAnalyze";
import { CreativeEvaluate } from "./routes/CreativeEvaluate";
import { Home } from "./routes/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "campaign", element: <CampaignAnalyze /> },
      { path: "creative", element: <CreativeEvaluate /> },
    ],
  },
]);
