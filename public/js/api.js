async function fetchAndDisplayUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/users");
    const data = await response.json();

    const userList = document.querySelector(".card-body ul");

    data.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.classList.add("d-flex", "mb-4", "pb-1");

      const avatarDiv = document.createElement("div");
      avatarDiv.classList.add("avatar", "flex-shrink-0", "me-3");

      const avatarImg = document.createElement("img");
      avatarImg.src = "img/icons/unicons/user.png";
      avatarImg.alt = "User";
      avatarImg.classList.add("rounded");

      avatarDiv.appendChild(avatarImg);

      const infoDiv = document.createElement("div");
      infoDiv.classList.add(
        "d-flex",
        "w-100",
        "flex-wrap",
        "align-items-center",
        "justify-content-between",
        "gap-2"
      );

      const userNameDiv = document.createElement("div");
      userNameDiv.classList.add("me-2");

      const userNameHeading = document.createElement("h6");
      userNameHeading.classList.add("mb-0");
      userNameHeading.textContent = user.name; // اطلاعات نام کاربر از API

      userNameDiv.appendChild(userNameHeading);

      const userProgressDiv = document.createElement("div");
      userProgressDiv.classList.add(
        "user-progress",
        "d-flex",
        "align-items-center",
        "gap-1"
      );

      const userLastNameSpan = document.createElement("span");
      userLastNameSpan.classList.add("text-muted");
      userLastNameSpan.textContent = user.username; // اطلاعات نام خانوادگی کاربر از API

      userProgressDiv.appendChild(userLastNameSpan);

      infoDiv.appendChild(userNameDiv);
      infoDiv.appendChild(userProgressDiv);

      listItem.appendChild(avatarDiv);
      listItem.appendChild(infoDiv);

      userList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching and displaying users:", error);
  }
}

// فراخوانی تابع برای دریافت اطلاعات کاربران و نمایش در صفحه
fetchAndDisplayUsers();
