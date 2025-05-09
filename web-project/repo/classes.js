import prisma from '@/repo/prisma';

export async function read(crn){
    const classes = prisma.class.findMany({
        include: {
            course: true,
            enrollments: true,
            instructor: true
        },
    });
    if(crn){
        const cls = prisma.class.findFirst({
            where: {
                crn: crn,
            },
            include: {
                course: true,
                enrollments: true,
                instructor: true
            },
        });
        if(!course){
            throw new Error(`Class with id ${crn} not found`);
        }
        return cls;
    }
    return classes;
}

export async function create(data){
    return await prisma.class.create({data});
}  

export async function update(crn, data){
    try {
        const verification = await prisma.class.findUnique({
          where: {crn: crn },
        });
    
        if (!verification) {
          return {
            error: {
              message: `Class with id ${crn} not found`,
              status: 404
            }
          };
        }
    
        const result = await prisma.class.update({
          where: { crn: crn },
          data
        });
        return result;
      } catch (e) {
        return {
          error: {
            message: `Failed to update class: ${e.message}`,
            status: 500
          }
        };
      }
}

export async function remove(crn){
    try{
        const verification = await prisma.class.findUnique({
            where: { crn: crn },
          });
      
          if (!verification) {
            return {
              error: {
                message: `Class with id ${crn} not found`,
                status: 404
              }
            };
          }
      
          const result = await prisma.class.delete({
            where: {crn: crn }
          });
          return result;
        } catch (e) {
          return {
            error: {
              message: `Failed to delete class: ${e.message}`,
              status: 500
            }
          };
        }
}

export async function getClassByCourse(course_id) {
  try {
    const classes = prisma.class.findMany({
      where: {
        course_id: course_id,
      }
    })
    return classes;
    // return [];
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}