export class CreateEntityManagmentDto {
  name: string;
  schema: string;
}

export class CreateLinkDto {
  from: string;
  to: string;
  linkType: 'OneToOne' | 'OneToMany' | 'ManyToMany';
}
