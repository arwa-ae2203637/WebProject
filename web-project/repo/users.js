import prisma from '@/repo/prisma';

export async function read(id){
    const users = prisma.user.findMany({
        include: {
            classes: true,
            enrollments: true,
        },
    });
    if(id){
        const user = prisma.user.findFirst({
            where: {
                id: id,
            },
            include: {
              classes: true,
              enrollments: true,
            },
        });
        if(!user){
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
    return users;
}

export async function filterInstructorByCrn(crn){
    const users = await prisma.user.findMany({
        where: {
            classes: {
                some: {
                    crn: crn,
                },
            },
        },
        include: {
            classes: true,
            enrollments: true,
        },
    });
    return users;
}


export async function create(data){
    return await prisma.user.create({data});
}  

export async function update(id, data){
    try {
        const verification = await prisma.user.findUnique({
          where: {id: id },
        });
    
        if (!verification) {
          return {
            error: {
              message: `User with id ${id} not found`,
              status: 404
            }
          };
        }
    
        const result = await prisma.user.update({
          where: { id: id },
          data
        });
        return result;
      } catch (e) {
        return {
          error: {
            message: `Failed to update user: ${e.message}`,
            status: 500
          }
        };
      }
}

export async function remove(id){
    try{
        const verification = await prisma.user.findUnique({
            where: { id: id },
          });
      
          if (!verification) {
            return {
              error: {
                message: `User with id ${id} not found`,
                status: 404
              }
            };
          }
      
          const result = await prisma.user.delete({
            where: {id: id }
          });
          return result;
        } catch (e) {
          return {
            error: {
              message: `Failed to delete user: ${e.message}`,
              status: 500
            }
          };
        }
}
