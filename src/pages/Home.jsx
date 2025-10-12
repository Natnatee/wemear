import React from "react";
import Dashboard from "@/components/Dashboard";
import { sampleProjects } from "@/make_data/sample_project";


function Home() {
  return <Dashboard projects={sampleProjects} />
}

export default Home;
