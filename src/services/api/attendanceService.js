import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export const attendanceService = {
  async getAll() {
    await delay();
    return [...attendance];
  },

  async getById(id) {
    await delay();
    const record = attendance.find(a => a.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async create(attendanceData) {
    await delay();
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay();
    const index = attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay();
    const index = attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance.splice(index, 1);
    return true;
  }
};