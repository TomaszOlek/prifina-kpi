import React from "react";
import DryRun from "../src/DryRun";

export default { title: "Dry Run Widget" };

export const box = () => <DryRun stage="dev" city="pori" />;
box.story = {
  name: "Dry Run Widget",
};
