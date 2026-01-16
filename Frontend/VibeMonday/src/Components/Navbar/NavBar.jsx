import { Box, Flex, Icon, IconButton } from '@vibe/core'
import CompanyLogo from "../../assets/Images/CompanyLogo.png"
// import CompanyLogo from "../../assets/Images/CompanyLogo.png"
import { DropdownChevronDown, PersonRound } from '@vibe/icons'
const NavBar = () => {
    return (
        <Box style={{backgroundColor:'#F0F7FF' , height :"70px", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            
            {/* <Flex justify='space-between'  > */}
                <img src={CompanyLogo} alt=""  style={{height:"28px"}}/>

                <Box>
                    <Flex  gap={5} justify='center'>

                    <Icon id="vibe-icon" iconType="svg" icon={PersonRound} iconLabel="my bolt svg icon" iconSize={32} />
                    <Icon id="vibe-icon" iconType="svg" icon={DropdownChevronDown} iconLabel="my bolt svg icon" iconSize={16} />
                    </Flex>

                </Box>
            {/* </Flex> */}
        </Box>





    )
}

export default NavBar