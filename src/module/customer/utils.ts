export function convertFilters(queryFilters: any, filters: any) {

  const {search, ...rest} = filters;

  if (search) {
    queryFilters['$or'] = [
      {
        firstName: {
          $regex: search ?? '',
          $options: "i"
        }
      },
      {
        lastName: {
          $regex: search ?? '',
          $options: "i"
        }
      },
      {
        email: {
          $regex: search ?? '',
          $options: "i"
        }
      },
      {
        phone: {
          $regex: search ?? '',
          $options: "i"
        }
      },
      {
        note: {
          $regex: search ?? '',
          $options: "i"
        }
      },
    ];
  }

  for (const key in rest) {

    queryFilters['$and'] = [
      {
        [key]: filters[key]
      }
    ];
    
  }

}
