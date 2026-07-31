"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/common/stat-card";
import { MOCK_STATS } from "@/constants/mock-data";
import { staggerContainer, listItemAnimation } from "@/lib/motion";

export function RoomStatsGrid() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {MOCK_STATS.map((stat) => (
        <motion.div key={stat.id} variants={listItemAnimation}>
          <StatCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
