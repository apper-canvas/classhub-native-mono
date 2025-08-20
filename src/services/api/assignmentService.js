import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export const assignmentService = {
  async getAll() {
    await delay();
    return [...assignments];
  },

  async getById(id) {
    await delay();
    const assignment = assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay();
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay();
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments.splice(index, 1);
    return true;
  }
};