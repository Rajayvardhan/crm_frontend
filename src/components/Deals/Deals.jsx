// Deals.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MeetingModal from './MeetingModal';
import api from '../../http';

const Deals = ({ selectedEmployee }) => {
  const [deals, setDeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  

  const [data, setData] = useState({
    columns: {
      untouched: { id: "untouched", title: "Untouched", bgColor: "#e0f7fa", tasks: [] },
      next_meeting: { id: "next_meeting", title: "Next Meeting", bgColor: "#d1c4e9", tasks: [] },
      quotation: { id: "quotation", title: "Quotation", bgColor: "#fff9c4", tasks: [] },
      won: { id: "won", title: "Won", bgColor: "#c8e6c9", tasks: [] },
      Loss: { id: "Loss", title: "Loss", bgColor: "#ffcdd2", tasks: [] },
    },
    columnOrder: ["untouched", "next_meeting", "quotation", "won", "Loss"],
  });

  const localUser = JSON.parse(localStorage.getItem("user"));
  const id = selectedEmployee || localUser?.id;

  useEffect(() => {
    if (id) fetchDeals();
  }, [id]);

  const fetchDeals = async () => {
    try {
      const res = await api.get(`http://localhost:5500/api/task/getDealss/${id}`);
      const dealsData = res.data;

      const updatedData = {
        ...data,
        columns: Object.fromEntries(
          Object.entries(data.columns).map(([key, value]) => [key, { ...value, tasks: [] }])
        ),
      };

      dealsData.forEach(deal => {
        const status = deal.Status || "untouched";
        if (updatedData.columns[status]) {
          updatedData.columns[status].tasks.push(deal);
        }
      });

      setData(updatedData);
      setDeals(dealsData);
    } catch (err) {
      console.error("❌ Error fetching deals:", err);
      toast.error("Failed to fetch deals");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTasks = Array.from(start.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);
      setData(prev => ({
        ...prev,
        columns: { ...prev.columns, [start.id]: { ...start, tasks: newTasks } },
      }));
      return;
    }

    const startTasks = Array.from(start.tasks);
    const [moved] = startTasks.splice(source.index, 1);
    const updatedDeal = { ...moved, Status: finish.id };
    const finishTasks = Array.from(finish.tasks);
    finishTasks.splice(destination.index, 0, updatedDeal);

    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [start.id]: { ...start, tasks: startTasks },
        [finish.id]: { ...finish, tasks: finishTasks },
      },
    }));

    try {
      await api.put('http://localhost:5500/api/task/updateDeals', {
        dealId: draggableId,
        newStage: finish.id,
      });
      toast.success(`✅ Deal status updated to ${finish.title}`);
    } catch (error) {
      console.error("Error updating deal status:", error);
      toast.error("❌ Failed to update deal status");
      fetchDeals();
    }
  };

  const handleOpenMeetingModal = (dealId) => {
    setSelectedDealId(dealId);
    setIsModalOpen(true);
  };

  const DealCard = ({ deal, index }) => (
    <Draggable draggableId={deal._id} index={index}>
      {(provided) => (
        <div
          className="card mb-3 p-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-body">
            <h5 className="card-title fw-semibold">{deal.title || `Deal #${deal._id.slice(-4)}`}</h5>
            <p className="text-muted small mb-1">{deal.description || "No description"}</p>
            <p className="text-muted small mb-1">Client: {deal?.lead?.name || "N/A"}</p>
            <p className="text-muted small mb-1">Date: {new Date(deal.createdAt).toLocaleDateString()}</p>
            <p className="text-muted small">Status: {deal.Status || "untouched"}</p>
          </div>
          <div className="dropdown position-absolute top-0 end-0">
            <a className="btn dropdown-toggle btn bg-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-patch-plus"></i>
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">New Task</a></li>
              <li>
                <button className="dropdown-item" onClick={() => handleOpenMeetingModal(deal._id)}>
                  Make a Meeting
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Draggable>
  );

  const Column = ({ column, tasks }) => (
    <div className="col-sm-6 col-md-3 mb-4">
      <div className="p-3 rounded" style={{ backgroundColor: column.bgColor }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="h6">{column.title}</h5>
          <span className="badge bg-primary">{tasks.length}</span>
        </div>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-vh-25 ${snapshot.isDraggingOver ? "bg-light p-2 rounded" : ""}`}
            >
              {tasks.map((deal, index) => (
                <DealCard key={deal._id} deal={deal} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );

  return (
    <div className="main-content dealsmanage">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h4>My Deals</h4>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row">
            {data.columnOrder.map(columnId => {
              const column = data.columns[columnId];
              const columnTasks = column.tasks;
              return <Column key={columnId} column={column} tasks={columnTasks} />;
            })}
          </div>
        </DragDropContext>
      </section>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDealId={selectedDealId}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
};

export default Deals;
