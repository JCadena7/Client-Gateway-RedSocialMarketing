export class User {
  constructor(
    public readonly id: number | null,
    public readonly externalId: string | null, // maps to usuarios.clerk_id (external auth id)
    public readonly nombre: string,
    public readonly email: string,
    public readonly rolId: number | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
