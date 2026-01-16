import { Box, Button, Chips, Divider, Flex, Icon, ModalContent, ModalFooter, Text } from '@vibe/core'
import { Activity, CloseSmall, CreditCard, Email, ExternalPage, Globe, Numbers, Tags, UserDomain } from '@vibe/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerTogInfo = ({
    setUserIfo,
    setSelectedDomain,
    selectedDomain,
    userInfo
}) => {

    const navigate = useNavigate()
      const [customerInfo, setCustomerInfo] = useState()
      const [customerInfoTag, setCustomerInfoTag] = useState([])
const token = localStorage.getItem("UserToken")

      useEffect(() => {
    if (!selectedDomain || !userInfo) return;

    const getBasicInfo = async () => {
      try {
        const res = await axios.get(
          `https://kindra-unsonorous-gale.ngrok-free.dev/api/partner-store/details`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Accept: "application/json",
               Authorization: `Bearer ${token}`
            },
            params: {
              shopDomain: selectedDomain,
            },
          }
        );

        console.log("BASIC INFO 👉", res.data.data);
        setCustomerInfo(res.data.data.shopJson);
        setCustomerInfoTag(res.data.data.tags)
      } catch (err) {
        console.log("error", err);
      }
    };

    getBasicInfo();
  }, [selectedDomain, userInfo]);

  return (
    <div>
        <Box className={`side-quickinformation-panel ${userInfo ? "open" : ""}`}>


          <Box className="header">
            <Flex align="center" justify="space-between">
              <Text type="text1" weight="bold">Quick Information</Text>

              <Button rightIcon={CloseSmall} kind="tertiary" onClick={() => setUserIfo(false)} size="small"></Button>
            </Flex>
          </Box>

          <ModalContent>
            <Box border style={{
              borderTopLeftRadius: "4px", borderTopRightRadius: "4px", border: "1px solid #D4852F",
            }}>
              {customerInfo &&

                <Flex direction="column" gap={12} >

                  <Box
                    padding="small"
                    style={{
                      width: "100%",
                      background: "#D4852F",
                      color: "#fff"
                    }}
                  >


                    <Flex direction="column" gap={15} align="start"  >
                      <Flex gap={10} wrap>
                        <Flex gap="xs" align="center">
                          <Icon icon={UserDomain} />
                          <Text type='text3' color="#FFFFFF">{customerInfo.name}</Text>
                        </Flex>


                        <div style={{ width: 1, height: 24, backgroundColor: "#ffffff" }} />


                        <Flex gap="xs" align="center">
                          <Icon icon={Email} />
                          <Text type='text3' color="#FFFFFF">{customerInfo.customer_email}</Text>
                        </Flex>
                      </Flex>


                      <Flex gap={10} wrap>
                        <Flex gap="xs" align="center">
                          <Icon icon={CreditCard} />
                          <Text type='text3' color="#FFFFFF">{customerInfo.domain}</Text>
                        </Flex>

                        <div style={{ width: 1, height: 24, backgroundColor: "#ffffff" }} />

                        <Flex gap="xs" align="center">
                          <Icon icon={Globe} />

                          <Text type='text3' color="#FFFFFF">{customerInfo.country_code}</Text>
                        </Flex>

                        <div style={{ width: 1, height: 24, backgroundColor: "#ffffff" }} />

                        <Flex gap="xs" align="center">
                          <Icon icon={Numbers} />
                          <Text type='text3' color="#ffffff">{customerInfo.phone}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>





                  <Box padding="small" style={{ width: "100%" }}>
                    <Flex direction="column" align="start" gap={10}>
                      <Flex gap={2} align="center" >
                        <Icon icon={Tags} />
                        <Text>Tags:</Text>
                        {customerInfoTag.map((tag) => (

                          <Chips label={tag} readOnly />
                        ))}
                        {/* <Chips label="HIGH UPSELL" readOnly /> */}
                      </Flex>
                      <Divider />


                      <Flex gap="small" align="center">
                        <Icon icon={Activity} />
                        <Text>Status:</Text>
                        <Chips
                          label="ACTIVE" readOnly
                          color="positive"
                        />
                      </Flex>

                      <Divider />

                      <Flex gap="small" align="center">
                        <Icon icon={Activity} />
                        <Text>
                          Segment: Gold users, High edit
                        </Text>
                      </Flex>

                    </Flex>

                  </Box>
                </Flex>
              }



            </Box>


          </ModalContent>

          <ModalFooter>
            {/* {pageData.map((user) => ( */}

            <Button
              onClick={() => navigate(`/customerdetails/${selectedDomain}`)}
              kind="secondary"
              rightIcon={ExternalPage}
              style={{ width: "100%" }}
            >
              View Full Profile

            </Button>
            {/* ))} */}
          </ModalFooter>
        </Box>
    </div>
  )
}

export default CustomerTogInfo