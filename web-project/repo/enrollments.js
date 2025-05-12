import prisma from '@/repo/prisma';

export async function read(id){
    const enrollments = prisma.enrollment.findMany({
        include: {
            student: true,
            class: true,
            course: true,
        },
    });
    if(id){
        const enrollment = prisma.enrollment.findFirst({
            where: {
                id: id,
            },
            include: {
              student: true,
              class: true,
              course: true,
            },
        });
        if(!enrollment){
            throw new Error(`Enrollment with id ${id} not found`);
        }
        return enrollment;
    }
    return enrollments;
}

export async function create(data){
    return await prisma.enrollment.create({data});
}  

export async function update(id, data){
    try {
        const verification = await prisma.enrollment.findUnique({
          where: {id: id },
        });
    
        if (!verification) {
          return {
            error: {
              message: `Enrollment with id ${id} not found`,
              status: 404
            }
          };
        }
    
        const result = await prisma.enrollment.update({
          where: { id: id },
          data
        });
        return result;
      } catch (e) {
        return {
          error: {
            message: `Failed to update enrollment: ${e.message}`,
            status: 500
          }
        };
      }
}

export async function remove(id){
    try{
    const verification = await prisma.enrollment.findUnique({
        where: { id: id },
      });
  
      if (!verification) {
        return {
          error: {
            message: `Enrollment with id ${id} not found`,
            status: 404
          }
        };
      }
  
      const result = await prisma.enrollment.delete({
        where: {id: id }
      });
      return result;
    } catch (e) {
      return {
        error: {
          message: `Failed to delete enrollment: ${e.message}`,
          status: 500
        }
      };
    }
}

// export async function fetchEnrollmentsByStudentAndCrn(studentId, crn) {
//   return await prisma.enrollment.findFirst({
//     where: {
//       student_id: parseInt(studentId),
//       crn: crn
//     },
//     include: {
//       class: true,
//       course: true,
//       student: true
//     }
//   });
// }

export async function fetchEnrollmentsByStudentAndStatus(studentId, status) {
  return await prisma.enrollment.findMany({
      where: {
          student_id: parseInt(studentId),
          status: status
      },
      include: {
          student: true,
          class: true,
          course: true,
      },
  });
}