"use client";

import { PRIORITY_ITEMS, TASK_ITEMS } from "@/lib/constants";
import { TaskPriority, TaskStatus, useTaskStore } from "@/lib/store/task-store";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function TaskFilters() {
  const {
    filters,
    sortBy,
    sortOrder,
    setStatusFilter,
    setPriorityFilter,
    setSearchFilter,
    setSortBy,
    setSortOrder,
    clearFilters,
  } = useTaskStore();

  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const timeoutId = setTimeout(() => {
      setSearchFilter(value || undefined);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleStatusFilter = (value: string) => {
    if (value === "all") {
      setStatusFilter(undefined);
    } else {
      setStatusFilter(value as TaskStatus);
    }
  };

  const handlePriorityFilter = (value: string) => {
    if (value === "all") {
      setPriorityFilter(undefined);
    } else {
      setPriorityFilter(value as TaskPriority);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as "dueDate" | "priority" | "createdAt");
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="min-w-[120px]">
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {TASK_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[120px]">
          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {PRIORITY_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[120px]">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSortOrderChange}
          className="min-w-[80px]"
        >
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearFilters();
              setSearchInput("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {filters.status && (
            <span className="bg-blue-100 px-2 py-1 rounded">
              Status: {filters.status.replace("_", " ")}
            </span>
          )}
          {filters.priority && (
            <span className="bg-green-100 px-2 py-1 rounded">
              Priority: {filters.priority}
            </span>
          )}
          {filters.search && (
            <span className="bg-yellow-100 px-2 py-1 rounded">
              Search: &quot;{filters.search}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
}
