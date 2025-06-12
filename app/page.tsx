import AddTaskBtn from "@/components/add-task-btn";
import { TaskBoard } from "@/components/task-board";
import { TaskFilters } from "@/components/task-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Task Management</h1>
        <div className="flex gap-4">
          <Link href="/recipes">
            <Button variant="outline">View Recipes</Button>
          </Link>
          <AddTaskBtn />
        </div>
      </div>
      
      <div className="space-y-6">
        <TaskFilters />
        <TaskBoard />
      </div>
    </main>
  );
}
