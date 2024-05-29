export function Roles(...roles: string[]) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('roles', roles, descriptor.value);
    return descriptor;
  };
}
