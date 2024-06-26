"use client";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import FeaturedListings from "@/components/home/home-v1/FeatuerdListings";
import Header from "@/components/home/home-v1/Header";
import listings from "@/data/listings";
import { BASE_URL } from "@/utilis/constants";
import axios from "axios";
import Modal from "react-modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { MdCancel } from "react-icons/md";

const customStyles = {
  content: {
    top: "52%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "0", // Remove padding
    backgroundColor: "transparent", // Make background transparent
    border: "none", // Remove border
    overflow: "hidden", // Ensure no overflow
    zIndex: 999999,
    width: "100%", // Adjust as necessary
    height: "90%", // Adjust as necessary
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent background
    zIndex: 999999, // Higher zIndex value for overlay
  },
};

function Page() {
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false); //
  const [pKey, setPkey] = useState("");
  const router = useRouter();

  function GetTitle() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    const data = listings.filter((elm) => elm.id == query)[0] || listings[0];
    return <div class="ms-auto">{data?.title}</div>;
  }

  function getDuration() {
    if (formData?.duration >= 12) {
      const years = formData.duration / 12;
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${formData?.duration} month${
        formData?.duration !== 1 ? "s" : ""
      }`;
    }
  }

  const parsePrice = (price) => {
    if (!price) return 0;
    const cleanedPrice = price
      .replace("$", "")
      .replace("₵", "")
      .replace(/,/g, "");
    const amount = parseFloat(cleanedPrice);
    if (isNaN(amount)) {
      console.error("Invalid amount:", price);
      return 0; // or handle this error case appropriately
    }
    return amount;
  };

  async function onSubmit() {
    const postData = {
      // first_name: formData.firstName,
      // last_name: formData.lastName,
      // email: formData.email,
      // mobile_number: formData.phone,

      username: process.env.NEXT_PUBLIC_MERCHANT_USERID,
      password: process.env.NEXT_PUBLIC_MERCHANT_PASSWORD,
      x_auth: process.env.NEXT_PUBLIC_X_AUTH,
      // customer_id: "4BDFB5479C224EE9",
      callback_url: "https://wemust.vercel.app",
      currency: formData.currency,
      amount: parsePrice(formData.price),
      payment_view_mode: "MODAL"
      // amount: "2",
      // ip_address: formData.iP,
    };

    

    // console.log(postData);
    setLoading(true);

    try {
      const sendRequest = await axios.post(`${BASE_URL}/api/credentials`, postData);
      setLoading(false);
      // console.log(sendRequest.data.public_key);
      if (sendRequest.data.public_key) {
        setIsOpen(true);

        setLoading(false);
        setPkey(sendRequest.data.public_key);
        // window.location.href = `http://localhost:3001/${sendRequest.data.public_key}`;
      }
      // console.log(sendRequest.data.public_key);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log(localStorage.getItem("formData"));
    setFormData(JSON.parse(localStorage.getItem("formData")));
  }, []);

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = "#000015";
  // }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const handlePaymentMessage = (event) => {
      if (event.data === "successful") {
        router.push("/status?status=success");
      } else if (event.data === "failed") {
        router.push("/status?status=failed");
      }
    };
    window.addEventListener("message", handlePaymentMessage);

    return () => {
      window.removeEventListener("message", handlePaymentMessage);
    };
  }, []);
  return (
    <Suspense fallback={<p>...loading</p>}>
      {/* <Header /> */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      <section className="bgc-f7  pt60 pb90">
        <div className="container">
          <div className="row " data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">Review Payment</h2>
                {/* <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p> */}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                {/* <Link className="ud-btn2" href="/grid-default">
                  See All Properties
                  <i className="fal fa-arrow-right-long" />
                </Link> */}
              </div>
            </div>
          </div>
          {/* End header */}

          <div className="row">
            <div
              className="col-lg-6 mx-auto "
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div
                style={{
                  backgroundColor: "white", // 50% transparency
                  // padding: '20px',
                  color: "black",
                }}
                className="  border mx-auto rounded d-flex flex-column p-2 "
              >
                <div className="p-2 me-3">
                  {/* <h4 className="text-center">Order Recap</h4> */}
                </div>
                <div className="p-2 d-flex">
                  <b className="col-4">First Name</b>
                  <div className="ms-auto">{formData?.firstName}</div>
                </div>
                <div className="p-2 d-flex">
                  <b className="col-4">Last Name</b>
                  <div className="ms-auto">{formData?.lastName}</div>
                </div>
                <div className="p-2 d-flex">
                  <b className="col-4">Telephone No.</b>
                  <div className="ms-auto">{formData?.phone}</div>
                </div>
                <div className="p-2 d-flex">
                  <b className="col-4">Email</b>
                  <div className="ms-auto">{formData?.email}</div>
                </div>

                <div className="border-top px-2 mx-2"></div>
                {/* <div class="p-2 d-flex pt-3">
                  <div class="col-8">
                    Total Deductible, Coinsurance, and Copay
                  </div>
                  <div class="ms-auto">$40.00</div>
                </div> */}
                {/* <div class="p-2 d-flex">
                  <div class="col-8">
                    Maximum out-of-pocket on Insurance Policy (not reached)
                  </div>
                  <div class="ms-auto">$6500.00</div>
                </div> */}
                <div className="border-top px-2 mx-2"></div>
                <div className="p-2 d-flex">
                  <b className="col-4">Property title</b>
                  {/* <div class="ms-auto">{data?.title}</div> */}
                  <GetTitle />
                </div>
                <div className="p-2 d-flex">
                  <b className="col-4">Duration</b>
                  <div className="ms-auto">{getDuration()}</div>
                </div>
                <div className="border-top px-2 mx-2"></div>
                <div className="p-2 d-flex pt-3">
                  <div className="col-8">
                    <b>Total</b>
                  </div>
                  <div className="ms-auto">
                    <b className="text-success">{formData?.price}</b>
                  </div>
                </div>
                <div className="col-md-5  mx-auto">
                  <div className="d-grid">
                    <button
                      disabled={loading}
                      onClick={onSubmit}
                      type="submit"
                      className="ud-btn btn-danger mt-2"
                    >
                      {loading ? (
                        <ClipLoader size={20} color="#fff" />
                      ) : (
                        <div>
                          {" "}
                          Pay with eganow{" "}
                          <i className="fal fa-arrow-right-long" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>

      {/* <button onClick={openModal}>Open Modal</button> */}

      <Modal
        className=""
        ariaHideApp={false}
        onClick={() => alert("sdf")}
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" text-center pb-md-4">
          <MdCancel
            onClick={closeModal}
            // style={{ top: 0 ,left: 430 }}
            size={24}
            className=" text-center shadow-lg  modal-close "
          />
        </div>
        <iframe
          // src={`http://localhost:3000/${pKey}`}
          src={`${BASE_URL}/${pKey}`}
          style={{
            width: "100%",
            height: "100%",
            margin: "0",
            backgroundColor: "transparent", // Semi-transparent background
          }}
        ></iframe>
      </Modal>
    </Suspense>
  );
}

export default Page;
