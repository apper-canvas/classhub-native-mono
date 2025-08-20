import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    const student = students.find(s => s.Id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay();
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      ...studentData,
      photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${studentData.firstName}${studentData.lastName}`
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay();
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  }
};