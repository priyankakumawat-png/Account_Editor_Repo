import { Box, Button, Chips, Divider, Flex, Icon, Info, Text } from '@vibe/core'
import { Archive, Edit, MoveArrowLeft, MoveArrowLeftNarrow, StrikethroughS } from '@vibe/icons'
import React, { useEffect, useState } from 'react'
import './CustomerDetail.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const CustomerDetail = () => {

const {id} = useParams();

// useEffect(() => {
//   const getCustomerDetails =  async () => {
//    try {
//      const res = await axios.get(`https://kindra-unsonorous-gale.ngrok-free.dev/api/partner-store/details?shopDomain=account-editor-flow.myshopify.com`,{
//         headers: {
//            "ngrok-skip-browser-warning": "true",
//            Accept: "application/json",
//          }
//      })

//      console.log('ghgh',res.data.data);
     
//    } catch (error) {
//     console.log('err', error);
    
//    }
//   }


//   getCustomerDetails()
// } ,[])
const navigate = useNavigate()
const [customerDetailData , setCustomerDetailData] = useState()
const [customerDetailDataTag , setCustomerDetailDataTag] = useState()
const [customerStatus , setCustomerStatus] = useState()
const [aEPlan , setAEPlan] = useState()

const token = localStorage.getItem("UserToken")

useEffect(() => {
  if (!id) return;

  const getCustomerDetails = async () => {
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
            shopDomain: id,
          },
        }
      );
        setCustomerDetailData(res.data.data.shopJson)
        setCustomerDetailDataTag(res.data.data.tags)
        setCustomerStatus(res.data.data)
        setAEPlan(res.data.data.planName)
      console.log("Customer Details 👉", res.data.data.shopJson);
    } catch (error) {
      console.log("API Error", error);
    }
  };

  getCustomerDetails();
}, [id]);



  return (
    <Box padding='small' style={{ backgroundColor: "#ffffff", borderRadius: "4px" }} className='customer-details-cont'>
      {/* <Flex direction='column' gap={12} align='start'> */}

      {/* HEADER */}

      
      <Flex justify="space-between" align="center" >
        <Flex gap={6} align="center" onClick={() => navigate("/")}>
          <MoveArrowLeft />
          <Text type="text1" weight="bold">Customer detail</Text>
        </Flex>

        <Flex gap="small">
          <Text type="text2" weight="medium"
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >View analytics</Text>

          {/* <Button kind="tertiary">View analytics</Button> */}
          <Button kind="primary" size='small'>Enable Paid Plan</Button>
        </Flex>
      </Flex>


{customerStatus && (

      <Box border style={{ width: "100%", padding: '12px' , borderRadius:"4px" }}>

        <Flex gap={12} wrap >

          <Box

            style={{ minWidth: 165, minHeight:'85px' , backgroundColor: "#F6F7FB", padding: '16px', borderRadius: '8PX' }}
          >
            <Flex direction="column" gap={6} align='start'>
              <Flex gap={2}>
                <Icon icon={StrikethroughS} />
                <Text color="secondary" >Lifetime value</Text>
              </Flex>
              <Text type="text1" weight="bold">{customerStatus.lifeTimeValue}</Text>
            </Flex>
          </Box>

          <Box
            style={{minWidth: 165, minHeight:'85px' , backgroundColor: "#F6F7FB", padding: '16px', borderRadius: '8PX' }}
          >
            <Flex direction="column" gap={6} align='start'>
              <Flex gap={2}>
                <Icon icon={StrikethroughS} />
                <Text color="secondary" >UpSell Revenue</Text>
              </Flex>
              <Text type="text1" weight="bold">{customerStatus.upsellRevenue}</Text>
            </Flex>
          </Box>

          <Box
            style={{ minWidth: 165, minHeight:'85px' , backgroundColor: "#F6F7FB", padding: '16px', borderRadius: '8PX' }}
          >
            <Flex direction="column" gap={6} align='start'>
              <Flex gap={2}>
                <Icon icon={Archive} />
                <Text color="secondary">Orders</Text>
              </Flex>
              <Text type="text1" weight="bold">{customerStatus.orders}</Text>
            </Flex>
          </Box>

          <Box
            style={{ minWidth: 165, minHeight:'85px' , backgroundColor: "#F6F7FB", padding: '16px', borderRadius: '8PX' }}
          >
            <Flex direction="column" gap={6} align='start' >
              <Flex gap={2}>
                <Icon icon={Edit} />
                <Text color="secondary">Total edits</Text>
              </Flex>
              <Text type="text1" weight="bold">{customerStatus.totalEdit}</Text>
            </Flex>
          </Box>

          <Box
            style={{minWidth: 165, minHeight:'85px' , backgroundColor: "#F6F7FB", padding: '16px', borderRadius: '8PX' }}
          >
            <Flex direction="column" gap={8} align='start'>
              <Flex gap={2}>
                <Icon icon={StrikethroughS} />
                <Text color="secondary">Customer revenue</Text>
              </Flex>
              <Text type="text1" weight="bold">{customerStatus.customerRevenue}</Text>
            </Flex>
          </Box>

        </Flex>
      </Box>
)}



      {/* CONTACT INFO */}
      <Box border  style={{ width: "100%", padding: "12px", borderRadius:"4px"}}>
        {customerDetailData && 
        <Flex direction='column' gap={12} align='start'>

          <Text type='text1' weight="medium">Contact information</Text>
          <Flex gap={16} wrap style={{ padding: "16px", backgroundColor: '#F6F7FB', borderRadius: '4px' }}>

            <Flex direction="column" gap={4} align='start'>
              <Text >Name</Text>
              <Text weight="bold">{customerDetailData.shop_owner}</Text>
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Phone</Text>
              <Text weight="bold">{customerDetailData.phone}</Text>
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Store name</Text>
              <Text weight="bold">{customerDetailData.name}</Text>
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Country</Text>
              <Text weight="bold">{customerDetailData.country}</Text>
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Status</Text>
              <Chips label={customerStatus.status} color="positive" readOnly  />
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Email</Text>
              <Text weight="bold">{customerDetailData.email}</Text>
            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Website</Text>
              <Text weight="bold">{customerDetailData.domain}</Text>
            </Flex>

            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

            <Flex direction="column" gap={4} align='start'>
              <Text >Tags</Text>
              <Flex >
                {customerDetailDataTag.map((tag) => (

                <Chips label={tag} readOnly  />
                ))}
                {/* <Chips label="HIGH UPSELL" readOnly /> */}
              </Flex>


            </Flex>
            <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />
            <Flex direction="column" gap={4} align='start'>
              <Text >Segment</Text>
              <Text type='text1' weight="bold">Gold users, High edit</Text>
            </Flex>

          </Flex>
          <Divider />

          {/* PLAN DETAILS */}

          <Box style={{ width: "100%" }}>
            <Flex direction='column' gap={16} align='start'>

              <Text type='text1' weight="medium">Plan details</Text>


              <Flex gap={18} style={{ padding: "16px", backgroundColor: '#F6F7FB', borderRadius: '4px', width: 'auto' }}>

                <Flex direction="column" gap={4} align='start'>
                  <Text >Store plan</Text>
                  <Text weight="bold">{customerDetailData.plan_name}</Text>
                </Flex>
                <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

                <Flex direction="column" gap={4} align='start'>
                  <Text >App plan</Text>
                  <Text weight="bold">{aEPlan}</Text>
                </Flex>
                <div style={{ width: 1, height: 34, backgroundColor: "#C3C6D4" }} />

                <Flex direction="column" gap={4} align='start'>
                  <Text >Store url</Text>
                  <Text weight="bold">{customerDetailData.myshopify_domain
}</Text>
                </Flex>

              </Flex>
            </Flex>
          </Box>
        </Flex>
        }




      </Box>
      {/* </Flex> */}




    </Box>
  )
}

export default CustomerDetail