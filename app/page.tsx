import AddTaskBtn from "@/components/add-task-btn";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Task Management</h1>
        <AddTaskBtn />
      </div>
      
      <div className="space-y-6">
      
      </div>
    </main>
  );
}
