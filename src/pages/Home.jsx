import React from "react";
import Project from "@/components/Project";

const sampleProjects = [
  { image: 'https://via.placeholder.com/300x200', name: 'MoralMan', owner: 'Designer', date: '15 May 25 | Published' },
  { image: 'https://via.placeholder.com/300x200', name: 'Untitled project', owner: 'Designer legacy', date: '3 Mar 25 | Published' },
  { image: 'https://via.placeholder.com/300x200', name: 'Untitled project', owner: 'Designer legacy', date: '24 Dec 24 | Published' },
  { image: 'https://via.placeholder.com/300x200', name: 'TCDC Virtual 360', owner: 'Designer', date: '12 Oct 24 | Published' },
  { image: 'https://via.placeholder.com/300x200', name: 'TEST SOUND', owner: 'Designer legacy', date: '20 Sep 24 | Unpublished' },
  { image: 'https://via.placeholder.com/300x200', name: 'Untitled project', owner: 'Designer legacy', date: '18 Sep 24 | Published' },
];

function Home() {
  return <Project projects={sampleProjects} />
}

export default Home;
