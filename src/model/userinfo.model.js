export class UseInfoModel{
  constructor(name, password, email, typeuser ) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.type = typeuser;
  }
}

export class AccoutLoginModel{
  constructor(password, email, typeuser ) {
    this.email = email;
    this.password = password;
    this.type = typeuser;
  }
}