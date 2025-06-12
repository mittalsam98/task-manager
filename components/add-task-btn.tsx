'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { TaskModal } from './task-modal';

export default function AddTaskBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Add Task
      </Button>
      
      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
