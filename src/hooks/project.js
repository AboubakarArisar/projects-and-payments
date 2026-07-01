// useProjects.js
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../constant";

const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  return projects;
};

export default useProjects;
