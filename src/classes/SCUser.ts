
export default class SCUser{
    private _id: number;
    private _email: string;
    private _userRole: string;

    constructor(id: number, email: string, userRole: string){
        this._id = id;
        this._email = email;
        this._userRole = userRole;
    }

    public set id(id: number){
        this._id = id;
    }

    public get id(){
        return this._id;
    }

    public set email(email: string){
        this._email = email;
    }

    public get email(){
        return this._email;
    }

    public set userRole(userRole: string){
        this._userRole = userRole;
    }

    public get userRole(){
        return this._userRole;
    }
}