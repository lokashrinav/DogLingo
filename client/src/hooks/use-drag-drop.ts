import { useState, useCallback } from "react";

export function useDragDrop() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropZones, setDropZones] = useState<Record<string, string>>({});

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.setData("text/plain", itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    
    if (itemId) {
      setDropZones(prev => {
        // Remove the item from any previous zone
        const newZones = { ...prev };
        Object.keys(newZones).forEach(key => {
          if (newZones[key] === itemId) {
            delete newZones[key];
          }
        });
        
        // Add to new zone
        newZones[zoneId] = itemId;
        return newZones;
      });
    }
    
    setDraggedItem(null);
  }, []);

  const resetDropZones = useCallback(() => {
    setDropZones({});
  }, []);

  return {
    draggedItem,
    dropZones,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    resetDropZones
  };
}
