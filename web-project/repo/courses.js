import prisma from '@/repo/prisma';

export async function read(id){
    const courses = prisma.course.findMany({
        include: {
            classes: true,
            enrollment: true,
        },
    });
    if(id){
        const course = prisma.course.findFirst({
            where: {
                id: id,
            },
            include: {
                classes: true,
                enrollment: true,
            },
        });
        if(!course){
            throw new Error(`Course with id ${id} not found`);
        }
        return course;
    }
    return courses;
}

export async function create(data){
    return await prisma.course.create({data});
}  

export async function update(id, data){
    try {
        const verification = await prisma.course.findUnique({
          where: {id: id },
        });
    
        if (!verification) {
          return {
            error: {
              message: `Course with id ${id} not found`,
              status: 404
            }
          };
        }
    
        const result = await prisma.course.update({
          where: { id: id },
          data
        });
        return result;
      } catch (e) {
        return {
          error: {
            message: `Failed to update course: ${e.message}`,
            status: 500
          }
        };
      }
}

export async function remove(id){
    try{
    const verification = await prisma.course.findUnique({
        where: { id: id },
      });
  
      if (!verification) {
        return {
          error: {
            message: `Course with id ${id} not found`,
            status: 404
          }
        };
      }
  
      const result = await prisma.course.delete({
        where: {id: id }
      });
      return result;
    } catch (e) {
      return {
        error: {
          message: `Failed to delete course: ${e.message}`,
          status: 500
        }
      };
    }
}

