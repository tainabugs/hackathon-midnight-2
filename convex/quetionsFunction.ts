import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createTask = mutation({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", { address: args.address });    
  },
});

export const getTaskList = query({
    args: { },
    handler: async (ctx, args) => {
      const tasks = await ctx.db
        .query("tasks")        
        .order("desc")
        .take(100);
      return tasks;
    },
  });