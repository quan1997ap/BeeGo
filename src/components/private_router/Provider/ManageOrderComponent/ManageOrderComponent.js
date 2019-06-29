import React, { Component, useState, useEffect } from "react";
import "./ManageOrderComponent.css";
import { Row, Col, Button, Table, Modal, Dialog } from "react-bootstrap";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { getAllOrder, acceptOrder, deliveryOrder } from "../../../../service/provider-service";
import { _validateNumber } from "../../../../configs/validates";
import axios, { post } from "axios";
import { rootPath } from "../../../../configs/enviroment";
import { _formatCurrency } from "../../../../configs/format";


const ManageOrderComponent = () => {
  const [orderList, setOrderList] = useState([]);
  const [showDetail, setshowDetail] = useState(false);
  const [orderDetail, setorderDetail] = useState({});
  const [customerDetail, setcustomerDetail] = useState({});
  const [orderStatus, setorderStatus] = useState(0);
  const [changing, setchanging] = useState(false);

  // useEffect(() => {
  //   console.log(showDetail);
  // }, [showDetail])

  // useEffect(() => {
  //   console.log(showDetail);
  // }, [showDetail])

  //component did mount
  useEffect(() => {
    _getOrders();
  }, []);

  const _getOrders = (orderId) =>{
    getAllOrder().then(resOrders => {
      if (resOrders && resOrders.data) {
        setOrderList(resOrders.data);
      }
    });
  }

  const _acceptOrder = (orderId) =>{
    setchanging(true);
    acceptOrder(orderId).then(
      resAcceptOrder =>{
        if(resAcceptOrder.data && resAcceptOrder.data.ok === 1){
            console.log(resAcceptOrder.data)
            setchanging(false);
        }
      }
    )
  }

  const _deliveryOrder = (orderId) =>{
    setchanging(true);
    deliveryOrder(orderId).then(
      resDeliveryOrder =>{
        if(resDeliveryOrder.data && resDeliveryOrder.data.ok === 1){
            setchanging(false);
            getAllOrder().then(resOrders => {
              if (resOrders && resOrders.data) {
                setOrderList(resOrders.data);
                ToastsStore.success("Thay Đổi trạng thái thành công thành công");
                closeOrderDetail();
              }
            });
        } else{
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
        }
      }
    )
  }

  const openOrderDetail = infoDetail => {
    setshowDetail(!showDetail);
    setorderDetail(infoDetail);
    setorderStatus(orderDetail.status);
    let _infoUserDetail =  (infoDetail.customerId && infoDetail.customerId.info !== undefined) ? infoDetail.customerId.info : {name : "", address: "", phone: ""} ;
    setcustomerDetail(_infoUserDetail);
  };

  const closeOrderDetail = () => {
    _getOrders();
    // setshowDetail(!showDetail);
  };

  const renderOrderList = () => {
    // console.log(orderList)
    let _orderList = orderList.map((order, index) => (
      <tr key={index}>
        <th scope="row">{order._id}</th>
        <th scope="row">{order.created.substring(0, 10)}</th>
        <td>{order.customerId.info.name}</td>
        <td>{order.customerId.info.phone}</td>
        <td>{_formatCurrency(order.totalPay)}</td>
        <td>
          {getStatus(order.status)}
        </td>
        <td>
          {" "}
          <Button onClick={() => openOrderDetail(order)}>Chi tiết </Button>
        </td>
      </tr>
    ));
    return _orderList;
  };

  const renderOrderDetail = () => {
    let _orderDetailList;
    if(orderDetail.orderDetails) {
       _orderDetailList = orderDetail.orderDetails.map((order, index) => (
        <tr key={index}>
          <td>{order.product.name}</td>
          <td>{order.product.description}</td>
          <td>{_formatCurrency(order.quantity)}</td>
          <td>{_formatCurrency(order.total)}</td>
  
        </tr>
      ));
    }
    return _orderDetailList;
  };

  const getStatus = (statusCode) => {
    let stustText = "";
    switch (statusCode) {
      case 0:
        stustText = "Chờ xác nhận";
        break;
      case 1:
        stustText = "Đã xác nhận";
        break;
      case 2:
        stustText = "Đang giao";
        break;
      case 3:
          stustText = "Hoàn thành";
        break;
      case 4:
          stustText = "Bị huỷ";
        break;
    }
    return stustText;
  };

  return (
    <div className="manage-order-component">
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
      <div
        className={
          showDetail === true
            ? "container-login100 Profile container"
            : "d-none"
        }
      >
        <div>
        <Button onClick={openOrderDetail} className="float-right btn-danger">Exit</Button>
        <table className="table table-striped border-table">
          <tbody>
            <tr className="title-tab td-title"><td style = {{maxWidth : 100}}>Thông tổng quan Order</td></tr>
            <tr><td>ID đơn hàng</td><td> {orderDetail._id ? orderDetail._id : ""}</td></tr>
            <tr><td>Thời gian tạo</td><td> {orderDetail.created ? orderDetail.created : ""}</td></tr>
            <tr><td>Tổng trị giá đơn hàng</td><td> {orderDetail.totalPay ? _formatCurrency(orderDetail.totalPay) : ""} </td></tr>
            <tr><td>Comment</td><td> {orderDetail.comment ? orderDetail.comment : ""} </td></tr>
            <tr><td>Trạng thái</td><td> {(orderDetail.status !== undefined) ? getStatus(orderDetail.status) : "none"} </td></tr>
          </tbody>
        </table>

        <table className="table table-striped border-table">
          <tbody>
            <tr className="title-tab td-title"><td style = {{maxWidth : 100}}>Thông tin khách hàng</td></tr>
            {/* <tr><td>Email</td><td> {JSON.stringify(orderDetail.customerId.email) } </td> </tr> */}
            <tr><td>Họ và tên</td><td> {customerDetail.name ? customerDetail.name : ""} </td></tr>
            <tr><td>Địa chỉ</td><td> {customerDetail.address ? customerDetail.address : ""}</td></tr>
            <tr><td>Số điện thoại </td><td> {customerDetail.phone ? customerDetail.phone : ""} </td></tr>
          </tbody>
        </table>

        <table className="table table-striped border-table">
          <tbody>
            <tr className="title-tab td-title"><td style = {{maxWidth : 100}}>Thông tin chi tiết Đơn hàng</td></tr>
            <tr>
              <th scope="col">Tên mặt hàng</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Tổng giá trị </th>
            </tr>
            {renderOrderDetail()}
          </tbody>
        </table>

        <table className="table table-striped border-table">
          <tbody>
            <tr className="title-tab td-title"><td>Xử lý đơn hàng</td></tr>
            <tr>
              <td>Chuyển trạng thái đơn đặt hàng</td>
              <td>
                <Button className = { orderDetail.status === 0 ? "" :"d-none" }
                  onClick = {() =>_acceptOrder(orderDetail._id)}
                > {changing ? "Đang chuyển trạng thái ..." : "Nhận đơn" } </Button>
                <Button className = { orderDetail.status === 1 ? "" :"d-none" } 
                  onClick = {() => _deliveryOrder(orderDetail._id)}
                >{changing ? "Đang chuyển trạng thái ..." : "Giao hàng" }</Button>
                <h4 className = { orderDetail.status === 2 ? "" :"d-none" } >Đơn giao đang được vận chuyển </h4>
                <h4 className = { orderDetail.status === 3 ? "" :"d-none" } >Đơn giao hoàn thành </h4>
                <h4 className = { orderDetail.status === 4 ? "" :"d-none" } >Đơn hàng bị hủy </h4>
              </td>

            </tr>
          </tbody>
        </table>

        </div>
      </div>
      <div
        className={
          showDetail !== true
            ? "container-login100 Profile container"
            : "d-none"
        }
      >
        <p className="title-tab">Danh sách Order</p>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID đơn hàng</th>
              <th scope="col">Thời gian tạo</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SĐT khách hàng</th>
              <th scope="col">Tổng giá trị đơn hàng</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Chi tiết</th>
            </tr>
          </thead>
          <tbody>{renderOrderList()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrderComponent;
