import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {
  const { user } = useContext(AuthContext);

  const  navigate =useNavigate()

  return (
    <div className="flex gap-10 items-center py-10 border-b">
      
     
      <div>
        <img
          src={user?.profilePic || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACUCAMAAADWBFkUAAAAZlBMVEXb29v////o6OgAAAD8/Pzy8vLf39/i4uL5+fnl5eXv7+/19fXY2Njr6+vV1dVGRkalpaWwsLCUlJTCwsLJycloaGhjY2NYWFiJiYmcnJxycnIuLi4hISF/f38KCgrPz88XFxe5uLh9HzMvAAAD9UlEQVR4nO2c13bbMAxAxU1KZOzYcZbTpv3/n6woWR7x4gSVlPctT74HBwDBoTRNpVKpVCqVSqVSqVQqlUqlUvnpcK6UMVgpwfu/dGmd6wjcdhIdkF2LRWmpywjTUXQO7YyYWYR1gy+qTsKYz8iXm+uqO2HD5xFgzY284zrksJmDrhadg6ulE8V1eevoaml5YVmXJDgOb0FXrfay98psh1TlbPHkSJ9co0txMdm9w5K72iJkirjqKbIUPWzcZfvWW8JWjbJ8jbpn50QYdDF4J9M72fblFb0tmI8tQuClJnbd4J28arL0k0UUuO/yxgy/uyLkebF98LRFHaiubtmH6n/1jWzfCfnlK9snEKSsoGi7UOjxN9l8/iFeNTZCIRe1vqpeyObvb0LWarH1l0WIwcnaTttnQM8HohvfGhsBa2PczojLwfaxLzSfKewAWKENi9jTENq+1FrHgeYsuDCyQ2j7vLUEtAPg4NrWJce0JWQVGNkeBZK5DFG6IhPLYF2QtsCpXRUOLF0n8a9ArL8a96G1fu/kgyn+8Ln22+wcAVFnbLetWXkPM19hTf7oTqF8JCrSVuaXFVOWrl/D28EIwLBgpt/i3nPiGfn3PPt1lsaGFmJu9NzU3KTLLctdT71cyF5mnkdJP8o2d1MQKW1ztzAu4jsBnG1TbTPafqe8/a87WPYh7FutvE3Y6cFl8k815r6EM/knxoQtjOY/dU5YZgA7nYRllr/I7A49FQbgsMbjauwOIAdhqXYPAImQMBVgzpsTdQWIjmBJs5xBXaAmmRqz78kmdIrVF+5uOkHmQmWtJfZ0EfhiOnb5Bbzca6JzQQK/vVNRgyP0A4WovgAxznwh9A4S9rp/godWGmyF7QnTLSQbpltM1u/J5UjRh5fYs9SKvQsccH99ayn6RHTQ5c6djJZ+fjvgOO52BR+znqDuNgc6G9fhAwJ2Kx8km4/riGivJYQ0c8jXM7hh8jTEVDI8ty9JjhHYtC2ztAYrPsuonqDtd1ClJSqVSuWHwLlQCoehhADrx7rhyrBOxpx+0OFj1PznNf201UaJHiln/xjVfaPgRs6pV9wcYsOQOE8Kp47rwbdJ/7IVp3xGcQpLXG864JzDg8SX6V6nBiG6CTfvOu5o2Yk2WTKkuzW/QapLnpRvU26Q5NsSHX/b5AiL14XI2b1utG3Sl4D3iL5NTflY7S6xn30DVdhEXGMQsLJ96sa0XdA8GIg4PQfsBxMy+N9tgPaDieAJJ+vcdZXArpv0ibg7gZ/0wZfYSFAq8DKhDXwPADInXiLoQUCpREAyQLZI+xoIKbNiiRD0zUaxRAhpCsU6Agp5FgA+fR3h3xTKpe2ttfcfg0kz8MrDAfUAAAAASUVORK5CYII="}
          alt="profile"
          className="w-36 h-36 rounded-full object-cover"
        />
      </div>

     
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <button
          onClick={()=> navigate("/edit-profile")}
          className="px-4 py-1 border rounded text-sm">
            Edit Profile
          </button>
        </div>

      
        <div className="flex gap-6 mt-4">
          <span><b>0</b> posts</span>
          <span><b>0</b> followers</span>
          <span><b>0</b> following</span>
        </div>

        
        <div className="mt-4 text-sm">
          <p className="font-semibold">{user?.username}</p>
          <p>{user?.bio || "No bio yet"}</p>
        </div>
      </div>

    </div>
  );
}
