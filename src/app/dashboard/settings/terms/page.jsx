"use client"
import React from 'react';
import PageHeader from '@/components/general/PageHeader';
import LegalPolicies from '@/components/general/LegalPolicies';

const sections = [
  {
    id: 1,
    heading: null,
    body: "Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque. Accumsan Nunc Risus Donec Quis Purus Sed Id. Diam Sit Massa Ornare Purus Nisi Quam. Donec Scelerisque Eu Lectus Aliquam Tellus Nisl Eget Ut. Consequat Faucibus Sagittis Semper Felis Orci Eu. Posuere Gravida Etiam Suspendisse Proin Auctor Netus. Aliquam At At Aliquam Eget. Aliquam Eget Pretium Malesuada Lacus In. Arcu Scelerisque Quis Dui Accumsan Sagittis Vel Eu.",
  },
  {
    id: 2,
    heading: "Lorem ipsum dolor sit amet consectetur.",
    body: "Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque. Accumsan Nunc Risus Donec Quis Purus Sed Id. Diam Sit Massa Ornare Purus Nisi Quam. Donec Scelerisque Eu Lectus Aliquam Tellus Nisl Eget Ut. Consequat Faucibus Sagittis Semper Felis Orci Eu. Posuere Gravida Etiam Suspendisse Proin Auctor Netus. Aliquam At At Aliquam Egestas Felis Eget. Pretium Malesuada Lacus In.",
  },
  {
    id: 3,
    heading: "Lorem ipsum dolor sit amet consectetur.",
    body: "Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque. Accumsan Nunc Risus Donec Quis Purus Sed Id. Diam Sit Massa Ornare Purus Nisi Quam.",
  },
  {
    id: 4,
    heading: "Lorem ipsum dolor sit amet consectetur.",
    body: "Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque.",
  },
];

const page = () => {
  return (
    <LegalPolicies data={sections} title={"Terms & Conditions"}/>
  );
};

export default page;
