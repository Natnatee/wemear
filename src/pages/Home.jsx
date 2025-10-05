import React from "react";
import Project from "@/components/Project";
import { sampleProjects } from "@/make_data/sample_project";


function Home() {
  return <Project projects={sampleProjects} />
}

export default Home;
